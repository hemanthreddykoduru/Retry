import os
import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Prevent OpenTelemetry logs locally
os.environ["OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED"] = "false"
os.environ["OTEL_PYTHON_LOG_LEVEL"] = "error"
os.environ["OTEL_TRACES_EXPORTER"] = "none"
os.environ["OTEL_METRICS_EXPORTER"] = "none"

# Set Nova Lite model for local execution
os.environ["BEDROCK_MODEL_ID"] = "amazon.nova-lite-v1:0"

from main import get_agent

app = FastAPI()

# Allow Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # Instantiate a fresh agent for each request to avoid concurrent invocation locks
    agent = get_agent()
    
    async def event_generator():
        try:
            async for chunk in agent.stream_async(request.prompt):
                if "content" in chunk and chunk["content"]:
                    # SSE format
                    yield f"data: {json.dumps({'content': chunk['content']})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
