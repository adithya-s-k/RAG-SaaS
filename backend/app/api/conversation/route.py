import logging
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.core.user import get_current_user
from app.services import conversation_service
from app.models.user_model import User

conversation_router = APIRouter(tags=["Conversation"])

logger = logging.getLogger("uvicorn")

load_dotenv()


@conversation_router.get("/")
async def get_new_conversation(
    current_user: User = Depends(get_current_user),
):
    try:
        new_conversation_id = ObjectId()
        # user_email = current_user.get("email") if current_user else None
        user_email = current_user.email

        await conversation_service.get_or_create_conversation(
            str(new_conversation_id), user_email
        )
        return {"conversation_id": str(new_conversation_id)}
    except Exception as e:
        logger.exception("Error creating new conversation", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating new conversation: {e}",
        ) from e


@conversation_router.get("/list")
async def get_conversation_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    try:
        conversations_by_date = (
            await conversation_service.get_all_conversations_for_user(
                current_user.email
            )
        )
        return {"conversations": conversations_by_date}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@conversation_router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str, current_user: Dict[str, Any] = Depends(get_current_user)
):
    conversation = await conversation_service.get_or_create_conversation(
        conversation_id, current_user.email
    )
    conversation["_id"] = str(conversation["_id"])
    return {"messages": conversation.get("messages", [])}


@conversation_router.get("/sharable/{conversation_id}")
async def get_sharable_conversation(conversation_id: str):
    conversation = await conversation_service.get_sharable_conversation(
        conversation_id,
    )
    if conversation is None:
        raise HTTPException(status_code=404, detail="Sharable conversation not found")
    return {"messages": conversation.get("messages", [])}


@conversation_router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str, current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        deleted_count = await conversation_service.delete_conversation(
            conversation_id, current_user.email
        )
        if deleted_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "message": f"Conversation {conversation_id} deleted successfully."
                },
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation {conversation_id} not found for the current user.",
            )
    except Exception as e:
        logger.exception("Error deleting conversation", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting conversation: {e}",
        ) from e


class ConversationSummaryUpdate(BaseModel):
    summary: str


@conversation_router.patch("/{conversation_id}/share")
async def edit_conversation_sharable(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
):
    try:
        success = await conversation_service.make_conversation_sharable(
            conversation_id, current_user.email
        )
        if success:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "message": f"Conversation {conversation_id} is now shareable."
                },
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation {conversation_id} not found for the current user.",
            )
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception("Error updating conversation shareable status", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating conversation shareable status: {str(e)}",
        ) from e


@conversation_router.patch("/{conversation_id}/summary")
async def edit_conversation_summary(
    conversation_id: str,
    summary_update: ConversationSummaryUpdate,
    current_user: User = Depends(get_current_user),
):
    try:
        matched_count = await conversation_service.edit_conversation_summary(
            conversation_id, current_user.email, summary_update.summary
        )
        if matched_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "message": f"Summary for conversation {conversation_id} updated successfully."
                },
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation {conversation_id} not found for the current user.",
            )
    except Exception as e:
        logger.exception("Error updating conversation summary", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating conversation summary: {e}",
        ) from e
