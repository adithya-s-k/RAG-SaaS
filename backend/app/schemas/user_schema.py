from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserAuth(BaseModel):
    email: EmailStr = Field(..., description="user email")
    first_name: str = Field(..., description="first name")
    last_name: str = Field(..., description="last name")
    password: str = Field(..., min_length=5, max_length=24, description="user password")


class UserOut(BaseModel):
    # user_id: UUID
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    role: Optional[str]


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
