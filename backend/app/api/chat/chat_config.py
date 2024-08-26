import logging
import os

from fastapi import APIRouter

from app.api.chat.models import ChatConfig


config_router = r = APIRouter()

logger = logging.getLogger("uvicorn")


@r.get("")
async def chat_config() -> ChatConfig:
    starter_questions = None
    # conversation_starters = os.getenv("CONVERSATION_STARTERS")
    conversation_starters = "Tell me about CognitiveLab \n What are some open source projects  \n Tell me about Open Source AI \n What are AI Agents"
    if conversation_starters and conversation_starters.strip():
        starter_questions = conversation_starters.strip().split("\n")
    return ChatConfig(starter_questions=starter_questions)
