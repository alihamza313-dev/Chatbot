from typing import Annotated
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

from langchain_core.messages import BaseMessage, HumanMessage
from config import llm


class LLM_state(TypedDict):
    messages : Annotated[list[BaseMessage],add_messages]

def chat_node(state: LLM_state):
    response = llm.invoke(state["messages"])
    return {
        "messages": [response]
    }


graph = StateGraph(LLM_state)

graph.add_node("chat_node", chat_node)

graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)

memory = MemorySaver()

chatbot = graph.compile(checkpointer=memory)
