from typing import List, Dict, Any, Optional
from bson import ObjectId, Binary
from datetime import datetime
from app.db import async_mongodb
from app.models.user_model import User
from uuid import UUID


class AdminService:
    @property
    def user_collection(self):
        return async_mongodb.db.users

    async def get_all_users(self) -> List[Dict[str, Any]]:
        users = await self.user_collection.find().to_list(length=None)
        return [self._serialize_user(User.from_mongo(user)) for user in users]

    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        user = await self.user_collection.find_one(
            {"user_id": Binary.from_uuid(UUID(user_id))}
        )
        return self._serialize_user(User.from_mongo(user)) if user else None

    async def edit_user(self, user_id: str, updated_data: Dict[str, Any]) -> bool:
        result = await self.user_collection.update_one(
            {"user_id": Binary.from_uuid(UUID(user_id))}, {"$set": updated_data}
        )
        return result.modified_count > 0

    async def delete_user(self, user_id: str) -> bool:
        result = await self.user_collection.delete_one(
            {"user_id": Binary.from_uuid(UUID(user_id))}
        )
        return result.deleted_count > 0

    def _serialize_user(self, user: User) -> Dict[str, Any]:
        return {
            "user_id": str(user.user_id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "disabled": user.disabled,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }


admin_service = AdminService()
