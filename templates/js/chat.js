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

        if(!response.ok){
            alert(data.detail || "에러가 발생했습니다.");
            chatWindow.removeChild(loadingMsg);
            // 채팅창 활성화
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


// function sendMessage(){
//     // 메세지를 전송하는 함수
//     const question = input.value.trim();
//     console.log("입력된 질문 : ", question)
//     if(!question) return;

//     // 예시 코드
//     const user = "user01"

//     // 사용자 질문 출력
//     const userMsg = document.createElement("div");
//     userMsg.className = "chat-message user";
//     userMsg.textContent = question;
//     chatWindow.appendChild(userMsg);

//     fetch("http://localhost:8000/chat", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({user, question})
//     })
//     .then(res => res.json())
//     .then(data =>{
//         const gptMsg = document.createElement("div");
//         gptMsg.className = "chat-message gpt";
//         gptMsg.innerHTML = data.answer.replace(/\n/g, "<br>");
//         chatWindow.appendChild(gptMsg);
//         chatWindow.scrollTop = chatWindow.scrollHeight;
//     })
//     .catch(err =>{
//         alert("에러가 발생했습니다." + err);
//     });


//     // 메세지 전송시 입력창 초기화
//     input.value = ""
// }