const widget = document.getElementById('widget');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typing = document.getElementById('typingIndicator');

let isDragging = false;
let hasMoved = false;
let offset = { x: 0, y: 0 };

const startDrag = (e) => {
    if (e.target.closest('input') || e.target.closest('button') || e.target.id === 'closeBtn') return;
    isDragging = true;
    hasMoved = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = widget.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;
    widget.style.transition = 'none';
};

const doDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let x = clientX - offset.x;
    let y = clientY - offset.y;
    x = Math.max(0, Math.min(x, window.innerWidth - widget.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - widget.offsetHeight));
    widget.style.left = x + 'px';
    widget.style.top = y + 'px';
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    hasMoved = true;
};

const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    widget.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    if (!hasMoved && !widget.classList.contains('expanded')) {
        expandWidget();
    }
};

widget.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', doDrag);
window.addEventListener('mouseup', stopDrag);
widget.addEventListener('touchstart', startDrag, { passive: false });
window.addEventListener('touchmove', doDrag, { passive: false });
window.addEventListener('touchend', stopDrag);

function expandWidget() {
    const isMobile = window.innerWidth <= 480;
    const expandWidth = isMobile ? window.innerWidth * 0.9 : 380;
    const expandHeight = isMobile ? window.innerHeight * 0.75 : 580;
    const rect = widget.getBoundingClientRect();
    let currentX = rect.left;
    let currentY = rect.top;
    if (currentX + expandWidth > window.innerWidth) currentX = window.innerWidth - expandWidth - 10;
    if (currentY + expandHeight > window.innerHeight) currentY = window.innerHeight - expandHeight - 10;
    widget.style.left = currentX + 'px';
    widget.style.top = currentY + 'px';
    setTimeout(() => widget.classList.add('expanded'), 10);
}

function addMessage(text, side) {
    const div = document.createElement('div');
    div.className = `msg ${side}`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botReply(userText) {
    typing.style.display = 'block';
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => {
        typing.style.display = 'none';
        let reply = "I'm processing your request regarding: " + userText;
        if (userText.toLowerCase().includes("pricing")) reply = "Our pricing is transparent and scales with your business.";
        addMessage(reply, 'bot');
    }, 1200);
}

function handleSendMessage() {
    const val = userInput.value.trim();
    if (val !== "") {
        addMessage(val, 'user');
        userInput.value = '';
        botReply(val);
    }
}

// Event listeners for both button click and Enter key
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

function quickMsg(text) {
    addMessage(text, 'user');
    botReply(text);
}

document.getElementById('closeBtn').onclick = (e) => {
    e.stopPropagation();
    widget.classList.remove('expanded');
};
