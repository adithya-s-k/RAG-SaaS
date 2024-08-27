from typing import List, Dict, Any, Optional
from app.db import async_mongodb
from app.api.chat.models import ChatConfig


class ConfigService:
    @property
    def config_collection(self):
        return async_mongodb.db.config

    async def get_chat_config(self) -> ChatConfig:
        config = await self.config_collection.find_one({"_id": "app_config"})
        if config:
            return ChatConfig(
                system_prompt=config.get("SYSTEM_PROMPT", ""),
                starter_questions=config.get("CONVERSATION_STARTERS", []),
            )
        return ChatConfig(system_prompt="", starter_questions=[])

    async def update_chat_config(self, updated_data: Dict[str, Any]) -> bool:
        result = await self.config_collection.update_one(
            {"_id": "app_config"}, {"$set": updated_data}, upsert=True
        )
        return result.modified_count > 0 or result.upserted_id is not None

    async def get_system_prompt(self) -> str:
        config = await self.config_collection.find_one({"_id": "app_config"})
        return config.get("SYSTEM_PROMPT", "") if config else ""

    async def update_system_prompt(self, new_prompt: str) -> bool:
        return await self.update_chat_config({"SYSTEM_PROMPT": new_prompt})

    async def update_conversation_starters(self, new_starters: List[str]) -> bool:
        return await self.update_chat_config({"CONVERSATION_STARTERS": new_starters})


config_service = ConfigService()
