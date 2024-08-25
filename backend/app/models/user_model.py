from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, EmailStr
from bson import Binary


class User(BaseModel):
    user_id: UUID = Field(default_factory=uuid4)
    email: EmailStr
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    disabled: Optional[bool] = None
    role: str = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False

    @property
    def create(self) -> datetime:
        return self.created_at

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {UUID: str}

    def to_mongo(self):
        # Convert the model to a dictionary
        data = self.model_dump()
        # Convert UUID to Binary for MongoDB storage
        data["user_id"] = Binary.from_uuid(data["user_id"])
        return data

    @classmethod
    def from_mongo(cls, data):
        # Convert Binary back to UUID
        if data.get("user_id"):
            data["user_id"] = data["user_id"].as_uuid()
        return cls(**data)
