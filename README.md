# 🐶 MINI-PROJECT-MUNGCHIVE 
> ChatGPT API를 활용한 견종 정보 백과 챗봇


## 🖥️ 프로젝트 소개
> FastAPI와 OpenAI API를 활용하여, 사용자가 견종 이름을 입력하면 해당 견종의 정보를 챗봇 형식으로 알려주는 웹 기반 애플리케이션입니다.
견종의 이름, 크기, 체고, 출신, 체중, 이름 유래, 주의사항 등을 대화 형식으로 제공하며,
로그인한 유저의 질문과 응답 기록을 저장됩니다.

# ⚙️ 실행 방법
```
uvicorn main:app --reload
```
접속: <http://127.0.0.1:8000>

# 📁 프로젝트 구조
```
API-PROJECT/
│
├── css/ # CSS 파일들을 위한 폴더
│ ├── chat.css # 채팅 페이지 스타일시트
│ ├── common.css # 브라우저 스타일 초기화를 위한 CSS
│ ├── login.css # 로그인 페이지 스타일시트
│ └── register.css # 회원가입 페이지 스타일시트
│
├── img/ # 이미지 파일들을 위한 폴더
│ ├── footprint.png # 발자국 아이콘 이미지
│ └── logo.png # 로고 이미지
│
├── js/ # 자바스크립트 파일들을 위한 폴더
│ ├── chat.js # 챗봇 대화 처리 및 UI 기능
│ ├── register-login.js # 로그인/회원가입 관련 기능 처리
│ ├── chat.html # 채팅 화면 HTML
│ ├── login.html # 로그인 페이지 HTML
│ └── register.html # 회원가입 페이지 HTML
│
├── user-chatHistory/ # 유저별 채팅 기록이 저장되는 폴더
│ └── {유저명}.json # 각 유저의 채팅 기록 JSON 파일
│
├── user_data.json # 회원가입된 유저 정보를 저장하는 JSON 파일
│
├── dogInfo.py # 견종 정보를 포함한 파이썬 모듈
├── main.py # FastAPI 백엔드 서버 메인 실행 파일
├── requirements.txt # 프로젝트 의존 패키지 목록
├── README.md # 프로젝트 설명 및 문서
└── .gitignore # Git에서 무시할 파일 목록 설정
```

# 📍 API 엔드포인트
|HTTP 메서드|엔드포인트|설명|
|------|---|---|
|post|/register|회원가입|
|post|/login|로그인|
|post|/chat|사용자의 질문 전송 및 응답 받기|
|get|/history/{username}|유저별 질문/답변 기록 조회|

## 📤 요청/응답 설정
```
POST /register
{
   "userId": "user01",
   "pwd": "pass123!"
}
{
   "message": "회원가입 완료!"
}
```
```
POST /login
{
   "userId": "user01",
   "pwd": "pass123!"
}
{
   "message": "로그인 성공!"
}
```
```
POST /chat
{
   "userId": "user01",
   "question": "푸들에 대해 알려줘"
}
{
   "question": "푸들에 대해 알려줘",
   "answer": "푸들은 프랑스에서..."
}
```
```
GET /history/user01
[
   {
      "question": "푸들에 대해 알려줘",
      "answer": "푸들은 프랑스에서..."
   },
   {
      "question": "시바견에 대해 알려줘",
      "answer": "시바견은 일본에서..."
   }
]
```
## ⛔ 예외처리 설계
### 회원가입
|조건|상태코드|메세지|
|------|----------|--------|
|아이디 == 비밀번호|400|"아이디와 비밀번호는 같을 수 없습니다."|
|비밀번호 5자 미만|400|"비밀번호는 최소 5자 이상이어야 합니다."|
|특수문자 미포함|400|"비밀번호에 최소 하나의 특수문자를 포함해야 합니다."|

### 로그인
|조건|상태코드|메세지|
|------|----------|-------|
|아이디 및 비밀번호 불일치|401|"아이디 또는 비밀번호가 틀렸습니다.|

### 질문 입력
|조건|상태코드|메시지|
|------|----------|--------|
|"(견종)에 대해 알려줘" 형식이 아닐 때|400|질문은 '(견종)에 대해 알려줘' 형식으로 입력해야 합니다.|

# 📦 요청/응답 스키마 (Pydantic)
## RegisterRequest
```json
{
   "userId": "string",
   "pwd": "string"
}
```

## ChatRequest
```json
{
   "userId": "string",
   "question": "푸들에 대해 알려줘"
}
```

## ChatResponse / HistoryItem 
```json
{
  "question": "푸들에 대해 알려줘",
  "answer": "푸들은 프랑스에서 유래한 견종으로..."
}
```
### 추가 설명
> - 'userId': 문자열, 회원 아이디
> - 'pwd': 문자열, 최소 5자 + 특수문자 1개 포함
> - 'question': 반드시 "(견종)에 대해 알려줘" 형식으로 작성
> - 'answer': OpenAI/딕서너리 기반 응답 텍스트

# 🧱 WBS (Work Breakdown Structure)
![image](https://github.com/user-attachments/assets/f1037c5e-3dd9-439f-b75d-ea1efdcd62c2)

