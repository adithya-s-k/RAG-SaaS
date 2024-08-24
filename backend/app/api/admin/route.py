import logging
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status

admin_router = APIRouter()

logger = logging.getLogger("uvicorn")

@admin_router.get("")
def admin_route():
  return {"Admin Route"}