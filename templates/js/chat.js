// 초기 접속시 안내 메세지
const welcomeMsg = `
<strong>안녕하세요! 견종 백과사전 챗봇 멍카이브🐶 입니다!</strong><br>
질문은 <em>"(견종)에 대해서 알려줘"</em> 라고 입력하면 됩니다!
`;


// 새로고침 해도 채팅 내용 유지
window.addEventListener("DOMContentLoaded", async() => {
    try{
        const meRes = await fetch("http://localhost:8000/me", {
            credentials: "include"
        });

        if (!meRes.ok) return;

        const meData = await meRes.json();
        const historyRes = await fetch("http://localhost:8000/history", {
            credentials: "include"
        });

        if (!historyRes.ok) return;

        const historyData = await historyRes.json();
        const chatWindow = document.querySelector(".chat-window");

        const gptWelcome = document.createElement("div");
        gptWelcome.className = "chat-message gpt";
        gptWelcome.innerHTML = welcomeMsg;
        chatWindow.appendChild(gptWelcome);

        historyData.history.forEach(entry => {
            const userMsg = document.createElement("div");
            userMsg.className = "chat-message user";
            userMsg.textContent = entry.question;
            chatWindow.appendChild(userMsg);

            const gptMsg = document.createElement("div");
            gptMsg.className = "chat-message gpt";
            gptMsg.innerHTML = entry.answer.replace(/\n/g, "<br>");
            chatWindow.appendChild(gptMsg);
        });


        chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch(err){
        console.error("채팅 기록 불러오기 실패: ", err);
    }
});

const input = document.getElementById("chat-input");
const button = document.getElementById("chat-send");
// 메세지 출력 영역
const chatWindow = document.querySelector(".chat-window");



button.addEventListener("click",sendMessage);
input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") sendMessage();
})

// 비동기 처리 방식
async function sendMessage() {
    // 메세지를 전송하는 함수
    const question = input.value.trim();
    console.log("입력된 질문 : ", question);
    if (!question) return;

    // 챗봇이 메세지를 보내는 중 입력창 및 버튼 비활성화
    input.disabled = true;
    button.disabled = true;

    // 사용자 질문 출력
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user";
    userMsg.textContent = question;
    chatWindow.appendChild(userMsg);

    // 로딩 말풍선
    const loadingMsg = document.createElement("div");
    loadingMsg.className = "chat-message gpt";
    loadingMsg.textContent = "챗봇이 답변을 보내고 있습니다.";
    chatWindow.appendChild(loadingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        console.log("응답 데이터: ", data);

        if(!response.ok){
            chatWindow.removeChild(loadingMsg);

            const errorMsg = document.createElement("div");
            errorMsg.className = "chat-message gpt";
            errorMsg.innerHTML = data.detail || "에러가 발생했습니다.";
            chatWindow.appendChild(errorMsg);

            chatWindow.scrollTop = chatWindow.scrollHeight;

            // 채팅 입력창 다시 활성화
            input.value = "";
            input.disabled = false;
            button.disabled = false;
            return;
        }

        // gtp 응답 출력(질문 전송 3초 후)
        setTimeout(() => {
            // 로딩 말풍선 출력 중단
            chatWindow.removeChild(loadingMsg)

            const gptMsg = document.createElement("div");
            gptMsg.className = "chat-message gpt";
            gptMsg.innerHTML = data.answer.replace(/\n/g, "<br>");
            chatWindow.appendChild(gptMsg);
            chatWindow.scrollTop = chatWindow.scrollHeight;

            // 챗봇이 메세지를 보낸 후 채팅 입력 활성화
            input.disabled = false;
            input.disabled = false;
        }, 3000);
    } catch (err) {
        alert("에러가 발생했습니다. " + err);
        chatWindow.removeChild(loadingMsg);
        // 오류 발생시 채팅 입력 활성화
        input.disabled = false;
        button.disabled = false;
    }

    // 메세지 전송시 입력창 초기화
    input.value = "";
}

// 로그아웃
document.querySelector(".logout")?.addEventListener("click", async() =>{
    try{
        await fetch("http://localhost:8000/logout", {
            method: "POST",
            credentials: "include"
        });
    } catch (err){
        console.log("로그아웃 실패", err);
    }finally{
        window.location.href = "login.html";
    }
});