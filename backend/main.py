from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from chatbot_core import get_response,get_stream_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class input_msg(BaseModel):
    message : str
    thread_id : str

@app.post("/chat")
async def query_response(input : input_msg):
    response =  await get_response(input.message , input.thread_id)
    return {"response": response}


@app.post("/chat/stream")
async def stream_chat(input : input_msg):
    async def generate():
        async for token in get_stream_response(input.message,input.thread_id):
            yield token

    return StreamingResponse(generate(),media_type="text/plain")
    


