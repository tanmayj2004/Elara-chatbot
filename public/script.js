const typingForm = document.querySelector(".typing_form");
const chatList = document.querySelector(".chat-list");

const toggleTheme = document.querySelector("#toggle-theme-button");
const deleteChats = document.querySelector("#delete-chat-button")

let usereMessage = null;
let isResponseGenerate= false;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;


const loadLocalStorage = () => {
    const savedChats = localStorage.getItem("savedChats");
    const isLightMode = (localStorage.getItem("themecolor") === "light_mode");

    document.bgitody.classList.toggle("light_mode", isLightMode);
    toggleTheme.innerText = isLightMode ? "dark_mode" : "light_mode";
    chatList.innerHTML = savedChats || " ";

    document.body.classList.toggle("hide-header", savedChats);
    chatList.scrollTo(0, chatList.scrollHeight);
}
loadLocalStorage();
const creatingMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
const showtypingEffect = (text, textElement, incomingMessageDiv) => {
    const word = text.split(' ');
    let currentwordIndex = 0;
    const timingInterval = setInterval(() => {
        textElement.innerText += (currentwordIndex === 0 ? ' ' : ' ') + word[currentwordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add(".hide");
        if (currentwordIndex === word.length) {
            clearInterval(timingInterval);
             isResponseGenerate= false;
            incomingMessageDiv.querySelector(".icon").classList.remove(".hide");
            localStorage.setItem("savedChats", chatList.innerHTML);
            chatList.scrollTo(0, chatList.scrollHeight);
        }
        chatList.scrollTo(0, chatList.scrollHeight);
    }, 75);
}
const generateApiResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: usereMessage }]
                }]
            })
        });
        const data = await response.json();
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        showtypingEffect(apiResponse, textElement, incomingMessageDiv);
    }
    catch (error) {
        console.log("error");
         isResponseGenerate= false;
    }
    finally {
        incomingMessageDiv.classList.remove("loading");
    }

}

const showLoadingAnimation = () => {
    const html = `<div class="message incoming loading">
            <div class="message-content">
                <img src="image/gemini.svg" alt="Gemini Image" class="avtar" id="rotate" ">
                <p class="text"></p> 
                    <div class="loading-indicator ">
                        <div class="loading-bar" ></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar "></div>
                    </div>
            </div>
            <spam onclick="copyMessage(this)"  class="icon material-symbols-rounded">content_copy </spam>
        </div>`;

    const incomingMessageDiv = creatingMessageElement(html, "incoming", "loading-indiactor");
    chatList.appendChild(incomingMessageDiv);

    generateApiResponse(incomingMessageDiv);
    chatList.scrollTo(0, chatList.scrollHeight);


}
const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done";
    setTimeout(() => copyIcon.innerText = "content_copy", 1000);
}


const handleOutgoingChat = () => {
    usereMessage = typingForm.querySelector(".typing_input").value.trim() || usereMessage;

    if (!usereMessage || isResponseGenerate) return; //EXIT IF MESSAGE NOT EXIST
     isResponseGenerate= true;

    const html = `<div class="message-content">
                <img src="image/user2.jpg" alt="user Image" class="avtar"  ">
                <p class="text"></p>
            </div>`;

    const outgoingMessageDiv = creatingMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText = usereMessage;
    chatList.appendChild(outgoingMessageDiv);
    typingForm.reset();
    chatList.scrollTo(0, chatList.scrollHeight);
    document.body.classList.add("hide-header");
    setTimeout(showLoadingAnimation, 500);

};

document.querySelectorAll('.suggtion').forEach(item => {
    item.addEventListener('click', event => {
      const suggestionText = event.target.innerText;
      document.querySelector('.typing_input').value = suggestionText; // Put suggestion text in input
      document.getElementById('send').click(); // Simulate a send action
    });
  });
    
    
toggleTheme.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light_mode");
    localStorage.setItem("themecolor", isLightMode ? "light_mode" : "dark_mode");
    toggleTheme.innerText = isLightMode ? "dark_mode" : "light_mode";
});
deleteChats.addEventListener("click", () => {
    if (confirm("Are you sure to want to delete all message ?")) {
        localStorage.removeItem("savedChats");
        loadLocalStorage();
    }
})

typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
})