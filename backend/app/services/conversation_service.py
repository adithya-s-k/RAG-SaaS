import logging
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from bson import ObjectId
from dotenv import load_dotenv
from app.db import async_mongodb


logger = logging.getLogger("uvicorn")

load_dotenv()


class ConversationService:
    @property
    def conversation_collection(self):
        return async_mongodb.db.conversation

    async def get_or_create_conversation(
        self, conversation_id: str, user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        conversation = await self.conversation_collection.find_one(
            {"_id": ObjectId(conversation_id)}
        )
        if not conversation:
            conversation = {
                "_id": ObjectId(conversation_id),
                "messages": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "summary": "New Chat",
            }
            if user_id:
                conversation["user_id"] = user_id
            await self.conversation_collection.insert_one(conversation)
        return conversation

    async def update_conversation(
        self,
        conversation_id: str,
        new_message: Dict[str, Any],
        summary: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> None:
        update_fields = {
            "$push": {"messages": new_message},
            "$set": {"updated_at": datetime.utcnow()},
        }

        if summary:
            update_fields["$set"] = update_fields.get("$set", {})
            update_fields["$set"]["summary"] = summary

        if user_id:
            update_fields["$set"] = update_fields.get("$set", {})
            update_fields["$set"]["user_id"] = user_id

        await self.conversation_collection.update_one(
            {"_id": ObjectId(conversation_id)}, update_fields
        )

    async def truncate_conversation(
        self, conversation_id: str, index: int, user_id: str
    ) -> None:
        conversation = await self.get_or_create_conversation(conversation_id)
        if conversation and conversation.get("user_id") == user_id:
            stored_messages = conversation.get("messages", [])
            truncated_messages = stored_messages[: index - 1]
            await self.conversation_collection.update_one(
                {"_id": ObjectId(conversation_id)},
                {
                    "$set": {
                        "messages": truncated_messages,
                        "updated_at": datetime.utcnow(),
                    }
                },
            )
        else:
            raise PermissionError("User ID does not match or conversation not found.")

    async def get_all_conversations_for_user(self, user_id: str):
        projection = {"summary": 1, "created_at": 1, "updated_at": 1}
        conversations_cursor = self.conversation_collection.find(
            {"user_id": user_id}, projection
        ).sort("updated_at", -1)
        conversations = await conversations_cursor.to_list(length=None)

        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday = today - timedelta(days=1)
        last_week = today - timedelta(days=7)

        categorized_conversations = {
            "today": [],
            "yesterday": [],
            "last_7_days": [],
            "before_that": [],
        }

        for conversation in conversations:
            conversation["_id"] = str(conversation["_id"])
            updated_at = conversation["updated_at"]

            if updated_at >= today:
                categorized_conversations["today"].append(conversation)
            elif updated_at >= yesterday:
                categorized_conversations["yesterday"].append(conversation)
            elif updated_at >= last_week:
                categorized_conversations["last_7_days"].append(conversation)
            else:
                categorized_conversations["before_that"].append(conversation)

        for category in categorized_conversations:
            categorized_conversations[category].sort(
                key=lambda x: x["updated_at"], reverse=True
            )

        return categorized_conversations

    async def delete_conversation(self, conversation_id: str, user_id: str) -> int:
        result = await self.conversation_collection.delete_one(
            {"_id": ObjectId(conversation_id), "user_id": user_id}
        )
        return result.deleted_count

    async def edit_conversation_summary(
        self, conversation_id: str, user_id: str, new_summary: str
    ) -> int:
        result = await self.conversation_collection.update_one(
            {"_id": ObjectId(conversation_id), "user_id": user_id},
            {
                "$set": {
                    "summary": new_summary,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        return result.matched_count

    async def get_sharable_conversation(
        self,
        conversation_id: str,
    ) -> Dict[str, Any]:
        conversation = await self.conversation_collection.find_one(
            {"_id": ObjectId(conversation_id), "sharable": True}
        )

        if conversation is None:
            return None

        conversation["_id"] = str(conversation["_id"])
        return conversation

    async def make_conversation_sharable(
        self, conversation_id: str, user_id: str
    ) -> bool:
        conversation = await self.conversation_collection.find_one(
            {"_id": ObjectId(conversation_id), "user_id": user_id}
        )

        if not conversation:
            return False

        if conversation.get("sharable", False):  # Changed True to False here
            return True

        result = await self.conversation_collection.update_one(
            {"_id": ObjectId(conversation_id), "user_id": user_id},
            {
                "$set": {
                    "sharable": True,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        return result.modified_count == 1


conversation_service = ConversationService()
