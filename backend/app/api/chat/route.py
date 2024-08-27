import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
    Query,
)
from llama_index.core.chat_engine.types import BaseChatEngine, NodeWithScore
from llama_index.core.llms import MessageRole

from app.api.chat.events import EventCallbackHandler
from app.api.chat.models import (
    ChatData,
    Message,
    Result,
    SourceNodes,
)
from app.api.chat.vercel_response import VercelStreamResponse
from app.api.chat.engine import get_chat_engine
from app.api.chat.engine.query_filter import generate_filters
from app.models.user_model import User
from app.core.user import get_current_user
from app.api.chat.summary import summary_generator
from app.services import conversation_service

chat_router = r = APIRouter()

logger = logging.getLogger("uvicorn")


# streaming endpoint - delete if not needed
@r.post("")
async def chat(
    request: Request,
    data: ChatData,
    conversation_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    if not conversation_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conversation ID is required for authenticated requests.",
        )
    try:
        USER_ID = current_user.email
        conversation = await conversation_service.get_or_create_conversation(
            conversation_id
        )
        if conversation:
            stored_messages = conversation.get("messages", [])
            incoming_messages = data.messages
            if len(incoming_messages) < len(stored_messages):
                await conversation_service.truncate_conversation(
                    conversation_id, len(incoming_messages), USER_ID
                )

        if conversation.get("summary") == "New Chat":
            if len(data.messages) <= 2:
                summary = await summary_generator(data.messages)
        else:
            try:
                summary = conversation.get("summary")
            except Exception as e:
                summary = "New Chat"
        last_message_content = data.get_last_message_content()
        messages = data.get_history_messages()

        await conversation_service.update_conversation(
            conversation_id,
            {"role": MessageRole.USER, "content": last_message_content},
        )

        doc_ids = data.get_chat_document_ids()
        filters = generate_filters(doc_ids)
        params = data.data or {}
        logger.info(
            f"Creating chat engine with filters: {str(filters)}",
        )
        chat_engine = get_chat_engine(filters=filters, params=params)

        event_handler = EventCallbackHandler()
        chat_engine.callback_manager.handlers.append(event_handler)  # type: ignore

        response = await chat_engine.astream_chat(last_message_content, messages)
        # process_response_nodes(response.source_nodes, background_tasks)

        final_response = ""
        suggested_questions = []
        source_nodes = []
        event = []
        tools = []

        async def enhanced_content_generator():
            nonlocal final_response, suggested_questions, source_nodes, event, tools
            async for chunk in VercelStreamResponse.content_generator(
                request, event_handler, response, data
            ):
                # print(chunk, end="", flush=True)  # Print each chunk in the backend
                yield chunk

                if chunk.startswith(VercelStreamResponse.TEXT_PREFIX):
                    final_response += json.loads(chunk[2:].strip())
                elif chunk.startswith(VercelStreamResponse.DATA_PREFIX):
                    data_chunk = json.loads(chunk[2:].strip())[0]
                    if data_chunk["type"] == "suggested_questions":
                        suggested_questions = data_chunk["data"]
                    elif data_chunk["type"] == "sources":
                        try:
                            source_nodes = data_chunk[
                                "data"
                            ]  # might have chidlen key value pair
                        except Exception:
                            source_nodes = []
                    elif data_chunk["type"] == "events":
                        try:
                            event = data_chunk[
                                "data"
                            ]  # might have chidlen key value pair
                        except Exception:
                            event = []  # might have chidlen key value pair
                    elif data_chunk["type"] == "tools":
                        try:
                            tools = data_chunk["data"]
                        except Exception:
                            tools = []

            await conversation_service.update_conversation(
                conversation_id,
                {
                    "role": MessageRole.ASSISTANT,
                    "content": final_response,
                    "annotations": [
                        {"type": "sources", "data": source_nodes},
                        {
                            "type": "suggested_questions",
                            "data": suggested_questions,
                        },
                        {"type": "events", "data": event},
                        {"type": "tools", "data": tools},
                    ],
                },
                summary=summary,
                user_id=USER_ID,
            )

        return VercelStreamResponse(
            request,
            event_handler,
            response,
            data,
            content=enhanced_content_generator(),
        )
    except Exception as e:
        logger.exception("Error in chat engine", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in chat engine: {e}",
        ) from e


# non-streaming endpoint - delete if not needed
# @r.post("/request")
# async def chat_request(
#     data: ChatData,
#     chat_engine: BaseChatEngine = Depends(get_chat_engine),
# ) -> Result:
#     last_message_content = data.get_last_message_content()
#     messages = data.get_history_messages()

#     response = await chat_engine.achat(last_message_content, messages)
#     return Result(
#         result=Message(role=MessageRole.ASSISTANT, content=response.response),
#         nodes=SourceNodes.from_source_nodes(response.source_nodes),
#     )


# def process_response_nodes(
#     nodes: List[NodeWithScore],
#     background_tasks: BackgroundTasks,
# ):
#     try:
#         # Start background tasks to download documents from LlamaCloud if needed
#         from app.api.chat.engine.service import LLamaCloudFileService

#         LLamaCloudFileService.download_files_from_nodes(nodes, background_tasks)
#     except ImportError:
#         logger.debug("LlamaCloud is not configured. Skipping post processing of nodes")
#         pass
