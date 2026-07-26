from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv
import os

load_dotenv()

# llm = HuggingFaceEndpoint(
#     repo_id="Qwen/Qwen2.5-7B-Instruct",
#     huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
#     temperature=0.7,
#     max_new_tokens=256
# )

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
def get_llm():
    llm = ChatMistralAI(model = "mistral-small-latest" , mistral_api_key = MISTRAL_API_KEY)
    return llm


llm = get_llm()