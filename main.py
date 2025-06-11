import requests
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware

# 별도의 견종 정보 py 파일
from dogInfo import generate_answer

app = FastAPI()

# CORS 설정정
origins = [
    "http://localhost:5500",  # html Live Server
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 출처 리스트
    allow_credentials=True, # 인증 정보 허용 여부 (쿠키 등)
    allow_methods=["*"],    # 허용할 HTTP 메서드
    allow_headers=["*"]
)

# pydantic 스키마
class ChatRequest(BaseModel):
    user: str
    question: str

class ChatResponse(BaseModel):
    question: str
    answer: str

# ChatGPT 프록시 서버 URL
CHATGPT_PROXY_URL = "https://dev.wenivops.co.kr/services/openai-api"

# /chat 엔드포인트
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.question.endswith("에 대해 알려줘"):
        raise HTTPException(status_code=400, detail="질문은 '(견종)에 대해 알려줘' 형식으로 입력해야 합니다.")
    
    bread = req.question.replace("에 대해 알려줘", "").strip()
    answer = generate_answer(bread)
    return {"question": req.question, "answer": answer}

    # try:
    #     response = requests.post(
    #         CHATGPT_PROXY_URL,
    #         json={"question": req.question}
    #     )
    #     data = response.json()

    #     return{
    #         "question": req.question,
    #         "answer": data.get("answer", "응답을 불러오지 못했습니다.")
    #     }
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail="CHATGPT 호출 실패 " + str(e))