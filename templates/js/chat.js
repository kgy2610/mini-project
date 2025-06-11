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

    // 테스트용 유저 코드
    const user = "user01";
    // 사용자 질문 출력
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user";
    userMsg.textContent = question;
    chatWindow.appendChild(userMsg);

    // 로딩 말풍선
    const lodingMsg = document.createElement("div");
    lodingMsg.className = "chat-message gpt";
    lodingMsg.textContent = "GPT가 답변을 보내고 있습니다.";
    chatWindow.appendChild(lodingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // 로딩 애니메이션
    let dotCount = 0;
    const dotInterval = setInterval(() => {
        // > . > .. > ... > > . 반복
        dotCount = (dotCount + 1) % 4;
        lodingMsg.textContent = "GPT가 답변을 보내고 있습니다" + ".".repeat(dotCount);
    }, 0);

    try {
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, question })
        });

        const data = await response.json();

        // 로딩/애니메이션 중단
        clearInterval(dotInterval);
        chatWindow.removeChild(lodingMsg);

        // gtp 응답 출력(질문 전송 3초 후)
        setTimeout(() => {
            const gptMsg = document.createElement("div");
            gptMsg.className = "chat-message gpt";
            gptMsg.innerHTML = data.answer.replace(/\n/g, "<br>");
            chatWindow.appendChild(gptMsg);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 0);
    } catch (err) {
        alert("에러가 발생했습니다. " + err);
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