from typing import List
from app.api.chat.models import Message
from llama_index.core.settings import Settings


async def summary_generator(
    messages: List[Message],
) -> str:
    # Reduce the cost by only using the last two messages
    last_user_message = None
    last_assistant_message = None
    for message in reversed(messages):
        if message.role == "user":
            last_user_message = f"User: {message.content}"
        elif message.role == "assistant":
            last_assistant_message = f"Assistant: {message.content}"
        if last_user_message and last_assistant_message:
            break
    conversation: str = f"{last_user_message}\n{last_assistant_message}"

    response = await Settings.llm.acomplete(
        prompt=f"""
        Here is the conversation history
        \n---------------------\n{messages}\n---------------------\n
        Given the a conversation between a user and an Medical AI assistant 
        give me one line summary of the conversation so that is instantly recognizable 
        make sure its really short don't mention user or assistant in the summary 
        dont start with conversation , discussion , inquiry it should always start with a keyboard of the conversation
        the summary should be short less then 5 to 10 words, straight to the point and distinct 
        """,
        formatted=False,
    )
    # print(response)
    return str(response)
