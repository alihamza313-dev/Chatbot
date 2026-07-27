from langchain_core.messages import BaseMessage, HumanMessage
from graph import chatbot

async def get_stream_response(question : str , thread_id : str):
    thread_id = thread_id

    config={
            "configurable": {
                    "thread_id": thread_id
                }
            }

    for message_chunk , metadata in chatbot.stream(
        { "messages": [ HumanMessage(content=question)]},
        config=config,
        stream_mode="messages"
        ):

        if message_chunk.content:
            yield message_chunk.content



async def get_response(question : str , thread_id : str):
    thread_id = thread_id

    config={
            "configurable": {
                    "thread_id": thread_id
                }
            }

    result = chatbot.invoke({ "messages": [ HumanMessage(content=question)]},config=config)

    return result["messages"][-1].content


if __name__ == "__main__":
    get_stream_response("what is the recipe of biryani" , 1)
