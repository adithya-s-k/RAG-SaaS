from uuid import UUID
from pydantic import BaseModel
from typing_extensions import Optional


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    sub: UUID = None
    exp: int = None


class ErrorOut(BaseModel):
    detail: str
    status_code: int


class AuthErrorOut(ErrorOut):
    error_description: Optional[str] = None
    error_code: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str
