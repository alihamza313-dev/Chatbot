from dotenv import load_dotenv
import os

from typing import Annotated
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

from langchain_core.messages import BaseMessage, HumanMessage
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace


load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
    temperature=0.7,
    max_new_tokens=256
)

model = ChatHuggingFace(llm = llm)


class LLM_state(TypedDict):
    messages : Annotated[list[BaseMessage],add_messages]

def chat_node(state: LLM_state):
    response = model.invoke(state["messages"])
    return {
        "messages": [response]
    }


graph = StateGraph(LLM_state)

graph.add_node("chat_node", chat_node)

graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)

memory = MemorySaver()

chatbot = graph.compile(checkpointer=memory)


thread_id = "chat-1"

print("=" * 50)
print("🤖 Chatbot")
print("Type 'exit' to quit.")
print("=" * 50)

config={
        "configurable": {
                "thread_id": thread_id
            }
        }

while True:
    print("-" * 50)
    user_input = input("\nYou: ")
    print(f"\nYou: {user_input}")

    if user_input.strip().lower() in ["exit", "quit"]:
        print("Bot: Goodbye!")
        break

    result = chatbot.invoke({ "messages": [ HumanMessage(content=user_input)]},config=config)

    print("\nBot:", result["messages"][-1].content)