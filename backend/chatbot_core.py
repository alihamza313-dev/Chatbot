from langchain_core.messages import BaseMessage, HumanMessage
from graph import chatbot

async def get_response(question : str , thread_id : str):
    thread_id = thread_id

    # print("=" * 50)
    # print("🤖 Chatbot")
    # print("Type 'exit' to quit.")
    # print("=" * 50)

    config={
            "configurable": {
                    "thread_id": thread_id
                }
            }

    # while True:
    #     print("-" * 50)
    #     user_input = input("\nYou: ")
    #     print(f"\nYou: {user_input}")

        # if user_input.strip().lower() in ["exit", "quit"]:
        #     print("Bot: Goodbye!")
        #     break

    result = chatbot.invoke({ "messages": [ HumanMessage(content=question)]},config=config)

    return result["messages"][-1].content

    # print("\nBot:", result["messages"][-1].content)