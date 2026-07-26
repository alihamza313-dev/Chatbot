// ==========================================================
// AI Assistant
// app.js
// ==========================================================

// ==========================================================
// Configuration
// ==========================================================

const API_URL = "http://127.0.0.1:8000/chat";


// ==========================================================
// DOM Elements
// ==========================================================

const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");

const chatWindow = document.getElementById("chat-window");

const typingIndicator = document.getElementById("typing-indicator");

const welcomeSection = document.querySelector(".welcome");

// ==========================================================
// Thread ID
// ==========================================================

let threadId = localStorage.getItem("thread_id");

if (!threadId) {

    threadId = crypto.randomUUID();

    localStorage.setItem("thread_id", threadId);

}

// ==========================================================
// Auto Focus
// ==========================================================

window.addEventListener("load", () => {
// window has :
//  |
//  ├── document
//  ├── location
//  ├── localStorage
//  ├── history
//  └── events

    input.focus();

});

// ==========================================================
// Auto Resize Textarea
// ==========================================================

input.addEventListener("input", () => {

    input.style.height = "auto";

    input.style.height = input.scrollHeight + "px";

// What is scrollHeight?

// It is the total height needed to show all content.
// Example:

// Textarea:
// Visible height:
// 40px

// Content requires:
// 120px

// Then:

// input.scrollHeight
// returns:
// 120
// So:
// input.scrollHeight + "px"
// becomes:
// "120px"

// Then:

// input.style.height = "120px";
// The textarea expands.

});

// ==========================================================
// Enter to Send
// Shift + Enter = New Line
// ==========================================================

input.addEventListener("keydown", (event) => {
    // keydown is basically the the keyboard keys event this occur immediately when the key press then the  browser create the event object. This object contains information about the keyboard event like 
//     event = {
//     key: "Enter",
//     shiftKey: false,
//     ctrlKey: false,
//     altKey: false,
//     ...
// }

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();
// it tells the browser:
// Don't perform the default Enter behaviour which usually give a new line in text feild.beacuse here Enter is meant to send the message.

        form.dispatchEvent(new Event("submit"));

    }

});

// ==========================================================
// Form Submit
// ==========================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();
// Normally when a form is submitted,
// the browser reloads the page.

    const message = input.value.trim();

    if (!message) return;

    hideWelcome();

    appendUserMessage(message);

    input.value = "";

    input.style.height = "auto";

    await sendMessage(message);

});

// ==========================================================
// Send Message
// ==========================================================

async function sendMessage(message) {

    disableComposer();

    showTyping();

// fetch(url, options)
// It accepts two arguments. The options object is optional. This controls how the request is sent.

// The second argument is simply a JavaScript object.
// {
//    method: "...",
//    headers: {...},
//    body: "...",
//    mode: "...",
//    cache: "...",
//    credentials: "...",
//    ...
// }

// without options JavaScript assumes
// {
//     method: "GET"
// }



    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: message,

                thread_id: threadId

            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        hideTyping();

        appendAIMessage(data.response);

    }

    catch (error) {

        hideTyping();

        appendAIMessage(

            "Sorry, I couldn't connect to the backend."

        );

        console.error(error);

    }

    finally {

        enableComposer();

    }

}

// ==========================================================
// Append User Message
// ==========================================================

function appendUserMessage(message) {

    const container = document.createElement("div");

    container.className = "message user";

    container.innerHTML = `

        <div class="bubble">

            <p>${escapeHTML(message)}</p>

            <span class="time">

                ${currentTime()}

            </span>

        </div>

    `;

    chatWindow.appendChild(container);

    scrollBottom();

}

// ==========================================================
// Append AI Message
// ==========================================================

function appendAIMessage(message) {

    const container = document.createElement("div");

    container.className = "message ai";

    container.innerHTML = `

        <div class="avatar">

            AI

        </div>

        <div class="bubble">

            <p>${escapeHTML(message)}</p>

            <span class="time">

                ${currentTime()}

            </span>

        </div>

    `;

    chatWindow.appendChild(container);

    scrollBottom();

}

// ==========================================================
// Show Typing
// ==========================================================

function showTyping() {

    typingIndicator.classList.remove("hidden");

    scrollBottom();

}

// ==========================================================
// Hide Typing
// ==========================================================

function hideTyping() {

    typingIndicator.classList.add("hidden");

}

// ==========================================================
// Hide Welcome
// ==========================================================

function hideWelcome() {

    if (welcomeSection) {

        welcomeSection.style.display = "none";

    }

}

// ==========================================================
// Scroll Bottom
// ==========================================================

function scrollBottom() {

    setTimeout(() => {

        chatWindow.scrollTo({

            top: chatWindow.scrollHeight,

            behavior: "smooth"

        });

    }, 50);

}

// ==========================================================
// Disable Composer
// ==========================================================

function disableComposer() {

    input.disabled = true;

    sendButton.disabled = true;

}

// ==========================================================
// Enable Composer
// ==========================================================

function enableComposer() {

    input.disabled = false;

    sendButton.disabled = false;

    input.focus();

}

// ==========================================================
// Current Time
// ==========================================================

function currentTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

// ==========================================================
// Escape HTML
// ==========================================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

// ==========================================================
// Future Features
// ==========================================================

/*

Future Roadmap

✓ Markdown Rendering

✓ Code Highlighting

✓ Copy Code Button

✓ Regenerate Response

✓ Stop Generation

✓ Streaming Responses

✓ Chat History

✓ Sidebar

✓ Theme Switch

✓ Voice Input

✓ Image Upload

✓ Drag & Drop Files

✓ Multiple Models

✓ Settings

✓ Authentication

✓ Export Chat

*/