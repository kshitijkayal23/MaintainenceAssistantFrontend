document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  const clearBtn = document.getElementById('clear-chat');
  const avatarSelector = document.getElementById('avatar-selector');

let userAvatar = '🧑'; // default neutral avatar


appendMessage("Hello! I'm your Maintenance Assistant. Ask me anything.", 'bot');

  input.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter' && input.value.trim()) {
      const msg = input.value.trim();
      appendMessage(msg, 'user');
      input.value = '';

      const loader = appendMessage("...", 'bot', true);

      try {
        const response = await fetch("http://localhost:8000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: msg })
        });
        const result = await response.json();

        loader.remove();
        appendMessage(result.answer || 'No response', 'bot');
      } catch (err) {
        loader.remove();
        appendMessage("Error: Could not reach backend.", 'bot');
      }
    }
  });

  clearBtn?.addEventListener('click', () => {
    log.innerHTML = '';
    appendMessage("Hello! I'm your Maintenance Assistant. Ask me anything.", 'bot');
  });

  function appendMessage(text, sender, isTyping = false) {
    const msgWrapper = document.createElement('div');
    msgWrapper.style.display = 'flex';
    msgWrapper.style.alignItems = 'flex-end';
    msgWrapper.style.marginBottom = '10px';
    msgWrapper.style.flexDirection = sender === 'user' ? 'row-reverse' : 'row';

    const avatar = document.createElement('div');
    avatar.innerHTML = sender === 'user' ? userAvatar : '🤖';
    avatar.style.fontSize = '20px';
    avatar.style.margin = '0 8px';

    const bubble = document.createElement('div');
    bubble.classList.add('msg', sender);
    bubble.style.padding = '12px 16px';
    bubble.style.borderRadius = '16px';
    bubble.style.maxWidth = '75%';
    bubble.style.position = 'relative';
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.style.wordWrap = 'break-word';
    bubble.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    bubble.style.fontSize = '14px';
    bubble.style.backgroundColor = sender === 'user' ? '#0078D7' : '#f0f0f0';
    bubble.style.color = sender === 'user' ? '#fff' : '#222';

    const tail = document.createElement('div');
    tail.style.width = 0;
    tail.style.height = 0;
    tail.style.border = '6px solid transparent';
    tail.style.position = 'absolute';
    tail.style.top = '8px';

    if (sender === 'user') {
      tail.style.borderRightColor = '#0078D7';
      tail.style.right = '-12px';
    } else {
      tail.style.borderLeftColor = '#f0f0f0';
      tail.style.left = '-12px';
    }

    const timestamp = document.createElement('div');
    timestamp.style.fontSize = '10px';
    timestamp.style.color = '#888';
    timestamp.style.marginTop = '6px';
    timestamp.textContent = new Date().toLocaleTimeString();

    if (isTyping) {
      bubble.innerHTML = `<span class="typing">...</span>`;
    } else {
      if (text.includes('```')) {
        const codeContent = text.replace(/```/g, '');
        bubble.innerHTML = `<pre style="background:#272822; color:#fff; padding:10px; border-radius:6px; overflow-x:auto">${codeContent}</pre>`;
      } else {
        bubble.innerHTML = text.replace(/\n/g, '<br/>');
      }
    }

    bubble.appendChild(tail);
    const contentWrapper = document.createElement('div');
    contentWrapper.appendChild(bubble);
    contentWrapper.appendChild(timestamp);

    msgWrapper.appendChild(avatar);
    msgWrapper.appendChild(contentWrapper);
    log.appendChild(msgWrapper);
    log.scrollTop = log.scrollHeight;

    return msgWrapper;
  }
});
