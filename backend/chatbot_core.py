from langchain_core.messages import BaseMessage, HumanMessage
from graph import chatbot

async def get_response(question : str , thread_id : str):
    thread_id = thread_id

    config={
            "configurable": {
                    "thread_id": thread_id
                }
            }

    result = chatbot.invoke({ "messages": [ HumanMessage(content=question)]},config=config)

    return result["messages"][-1].content
