from fastapi import APIRouter, Depends, HTTPException, Response, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.services import user_service
from app.core.security import create_access_token, create_refresh_token
from app.schemas.auth_schema import TokenSchema
from app.schemas.user_schema import UserOut
from app.models.user_model import User
from app.core.user import get_current_user
from app.core.config import settings
from app.schemas.auth_schema import TokenPayload, AuthErrorOut, RefreshTokenRequest
from app.schemas.user_schema import UserAuth, UserUpdate
from pydantic import ValidationError
from jose import JWTError, jwt
import pymongo

auth_router = APIRouter()


@auth_router.post("/signup", summary="Create new user", response_model=dict)
async def create_user(data: UserAuth):
    try:
        user = await user_service.create_user(data)
        return {
            "status": "success",
            "user": UserOut(
                # user_id=user.user_id,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                role=user.role,
            ),
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )


@auth_router.post(
    "/login",
    summary="Create access and refresh tokens for user",
    response_model=TokenSchema,
)
@auth_router.post(
    "/login",
    summary="Create access and refresh tokens for user",
    response_model=TokenSchema,
)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await user_service.authenticate(
        email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    return {
        "access_token": create_access_token(user.user_id),
        "refresh_token": create_refresh_token(user.user_id),
    }


# @auth_router.post("/refresh", summary="Refresh token", response_model=TokenSchema)
# async def refresh_token(refresh_token: str = Body(...)):
#     try:
#         payload = jwt.decode(
#             refresh_token,
#             settings.JWT_REFRESH_SECRET_KEY,
#             algorithms=[settings.ALGORITHM],
#         )
#         token_data = TokenPayload(**payload)
#     except (jwt.JWTError, ValidationError):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Invalid token",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     user = await user_service.get_user_by_id(token_data.sub)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Invalid token for user",
#         )
#     return {
#         "access_token": create_access_token(user.user_id),
#         "refresh_token": create_refresh_token(user.user_id),
#     }


@auth_router.post(
    "/refresh",
    response_model=TokenSchema,
    summary="Refresh token",
    responses={403: {"model": AuthErrorOut}, 404: {"model": AuthErrorOut}},
)
async def refresh_token(response: Response, refresh_request: RefreshTokenRequest):
    try:
        payload = jwt.decode(
            refresh_request.refresh_token,
            settings.JWT_REFRESH_SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await user_service.get_user_by_id(token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for user",
        )

    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    new_access_token = create_access_token(user.user_id)
    new_refresh_token = create_refresh_token(user.user_id)

    # Set cookies
    response.set_cookie(
        key="accessToken",
        value=new_access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=settings.COOKIE_SECURE,  # True in production
    )
    response.set_cookie(
        key="refreshToken",
        value=new_refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=settings.COOKIE_SECURE,  # True in production
    )

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
    }


@auth_router.get(
    "/me", summary="Get details of currently logged in user", response_model=UserOut
)
async def get_me(user: User = Depends(get_current_user)):
    return user


@auth_router.get("/verify-admin", response_model=dict)
async def verify_admin(current_user: User = Depends(get_current_user)):
    if not current_user.role or current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an admin",
        )
    return {"isAdmin": True}


@auth_router.post("/update", summary="Update User", response_model=UserOut)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        return await user_service.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist"
        )


@auth_router.post(
    "/test-token", summary="Test if the access token is valid", response_model=UserOut
)
async def test_token(user: User = Depends(get_current_user)):
    return user
