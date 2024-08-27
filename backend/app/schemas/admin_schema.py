from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime
from uuid import UUID


class UserOut(BaseModel):
    user_id: UUID
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    disabled: Optional[bool] = None
    created_at: datetime


class UsersOut(BaseModel):
    users: List[UserOut]


class MessageOut(BaseModel):
    message: str


class ErrorOut(BaseModel):
    detail: str
    status_code: int


class AuthErrorOut(ErrorOut):
    error_description: Optional[str] = None
    error_code: Optional[str] = None
