import logging
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status

conversation_router = APIRouter()

logger = logging.getLogger("uvicorn")

@conversation_router.get("")
def conversation_route():
  return {"Conversation Route"}