import logging
import os

from fastapi import APIRouter

from app.api.chat.models import ChatConfig
from app.services.config_service import config_service

config_router = r = APIRouter()

logger = logging.getLogger("uvicorn")


@r.get("")
async def chat_config() -> ChatConfig:
    return await config_service.get_chat_config()
