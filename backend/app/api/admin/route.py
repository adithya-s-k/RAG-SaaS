from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr
from app.core.user import get_current_user
from app.models.user_model import User
from app.services.admin_service import admin_service
from app.schemas.admin_schema import UserOut, UsersOut, MessageOut, ErrorOut

admin_router = APIRouter()


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    disabled: Optional[bool] = None


def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this resource",
        )
    return current_user


@admin_router.get(
    "/users", response_model=UsersOut, responses={403: {"model": ErrorOut}}
)
async def get_all_users(admin: User = Depends(verify_admin)) -> UsersOut:
    users = await admin_service.get_all_users()
    return UsersOut(users=[UserOut(**user) for user in users])


@admin_router.get(
    "/users/{user_id}",
    response_model=UserOut,
    responses={403: {"model": ErrorOut}, 404: {"model": ErrorOut}},
)
async def get_user(user_id: str, admin: User = Depends(verify_admin)) -> UserOut:
    user = await admin_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**user)


@admin_router.put(
    "/users/{user_id}",
    response_model=MessageOut,
    responses={403: {"model": ErrorOut}, 404: {"model": ErrorOut}},
)
async def edit_user(
    user_id: str, user_update: UserUpdate, admin: User = Depends(verify_admin)
) -> MessageOut:
    success = await admin_service.edit_user(
        user_id, user_update.model_dump(exclude_unset=True)
    )
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return MessageOut(message="User updated successfully")


@admin_router.delete(
    "/users/{user_id}",
    response_model=MessageOut,
    responses={
        403: {"model": ErrorOut},
        404: {"model": ErrorOut},
        400: {"model": ErrorOut},
    },
)
async def delete_user(user_id: str, admin: User = Depends(verify_admin)) -> MessageOut:
    user = await admin_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["role"] == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete an admin user")

    success = await admin_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete user")
    return MessageOut(message="User deleted successfully")
