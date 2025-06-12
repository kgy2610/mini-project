// 회원가입
const registerForm = document.getElementById("registerForm");
if (registerForm){
    registerForm.addEventListener("submit", async(e)=>{
        e.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try{
            const res = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body:JSON.stringify(data)
            });

            const result = await res.json();
            if(res.ok){
                alert(result.message);
                window.location.href = "login.html"
            } else{
                alert(result.detail);
            }
        } catch(err){
            alert("에러가 발생했습니다." + err)
        }
    });
}

// 로그인
const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try{
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                // 쿠키 저장
                body: JSON.stringify(data)
            });
            
            const result = await res.json();
            if (res.ok){
                alert(result.message);
                window.location.href = "chat.html";
                // 로그인 성공시 채팅으로 이동
            } else{
                alert(result.detail);
            }
        } catch(err){
            alert("에러가 발생했습니다.". err)
        }
    })
}