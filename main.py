from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5500",  # html Live Server
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # 허용할 출처 리스트
    allow_credentials=True,           # 인증 정보 허용 여부 (쿠키 등)
    allow_methods=["*"],              # 허용할 HTTP 메서드
    allow_headers=["*"]
)