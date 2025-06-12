import requests
from fastapi import FastAPI, Request, HTTPException, Cookie
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

import re
# json
import os
import json
# 별도의 견종 정보 py 파일
from dogInfo import generate_answer

app = FastAPI()
USER_FILE = "user_data.json"

# CORS 설정
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
# login/register
class RegisterUser(BaseModel):
    name: str
    userId: str
    pwd: str

class LoginUser(BaseModel):
    userId: str
    pwd: str

# chat
class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    question: str
    answer: str

# ChatGPT 프록시 서버 URL
CHATGPT_PROXY_URL = "https://dev.wenivops.co.kr/services/openai-api"

# json 읽기/쓰기 함수
def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USER_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

# /register 엔드포인트
@app.post("/register")
def register(user: RegisterUser):
    users = load_users()
    
    if user.userId in users:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디 입니다.")
    
    if user.userId == user.pwd:
        raise HTTPException(status_code=400, detail="아이디와 비밀번호는 같을 수 없습니다.")
    
    if len(user.pwd) < 5:
        raise HTTPException(status_code=400, detail="비밀번호는 최소 5자 이상이어야 합니다.")
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", user.pwd):
        raise HTTPException(status_code=400, detail="비밀번호에 최소 하나의 특수문자를 포함해야 합니다.")
    
    users[user.userId] = {
        "name": user.name,
        "pwd": user.pwd
        }
    save_users(users)
    return {"message": "회원가입 성공!"}

# /login 엔드포인트
@app.post("/login")
def login(user: LoginUser):
    users = load_users()
    if user.userId in users and users[user.userId]["pwd"] == user.pwd:
        response = JSONResponse(content={"message": "로그인 성공!"})
        response.set_cookie(key="user", value=user.userId, httponly=True)
        return response
    
    raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 틀렸습니다.")

# 로그인 유지 확인
@app.get("/me")
def get_current_user(user:Optional[str] = Cookie(default=None)):
    if user:
        return {"userId": user, "message": "현재 로그인된 사용자입니다."}
    raise HTTPException(status_code=401, detail="현재 로그인된 사용자가 없습니다.")

# /chat 엔드포인트
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest,user: Optional[str] = Cookie(default=None)):
    if not user:
        raise HTTPException(status_code=401, detail="로그인 후 질문해주세요.")
    
    if not re.match(r"^.+에 대해 알려줘$", req.question):
        raise HTTPException(status_code=400, detail="질문은 '(견종)에 대해 알려줘' 형식으로 입력해야 합니다.")
    
    bread = req.question.replace("에 대해 알려줘", "").strip()
    answer = generate_answer(bread)

    # # 채팅 기록 저장
    # folder = "user-chatHistory"
    # os.makedirs(folder, exist_ok=True)
    # filepath = os.path.join(folder, f"{user}.json")

    # # 기존 기록 불러오기
    # if os.path.exists(filepath):
    #     with open(filepath, "r", encoding="utf-8") as f:
    #         chat_data = []

    # # 새로운 질문/답변 추가
    # chat_data.append({
    #     "question": req.question,
    #     "answer": answer
    # })

    # # 파일 저장
    # with open(filepath, "w", encoding="utf-8") as f:
    #     json.dump(chat_data, f, ensure_ascii=False, indent=2)

    return {"question": req.question, "answer": answer}