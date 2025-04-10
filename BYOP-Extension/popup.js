document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  const clearBtn = document.getElementById('clear-chat');
  const closeChatBtn = document.getElementById('close-chat');
  const expandInfo = document.getElementById('expand-info');

  expandInfo?.addEventListener('click', () => {
    window.parent.postMessage({ type: "EXPAND_CHATBOT" }, "*");
  });

  let userAvatar = '🧑'; 
  let selectedApi = CONFIG.METADATA_API_URL;

  const pillButtons = document.querySelectorAll('#query-toggle .pill');
  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      selectedApi = mode === 'datasource'
        ? CONFIG.METADATA_API_URL
        : CONFIG.DOC_QA_API_URL;
    });
  });

  appendMessage("Hello! I'm your Maintenance Assistant. Ask me anything.", 'bot');

  input.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter' && !e.shiftKey && input.value.trim()) {
      e.preventDefault();
      const msg = input.value.trim();
      appendMessage(msg, 'user');
      input.value = '';

      const loader = appendMessage("...", 'bot', true);
      console.log("Using selected API:", selectedApi);
      try {
        const response = await fetch(selectedApi, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: msg })
        });

        const result = await response.json();
        loader.remove();

        let answerText = "No response";

        if (result.message?.top_matches?.[0]?.content) {
          // Document QA API
          answerText = result.message?.top_matches[0].content;
        } else if (result.message?.answer) {
          // Metadata/Realtime API
          answerText = result.message?.answer;
        }

        appendMessage(answerText, 'bot');

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

  closeChatBtn?.addEventListener('click', () => {
    window.parent.postMessage({ type: "CLOSE_CHATBOT_IFRAME" }, "*");
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
      }

      else if (text.length > 300) {
        const shortText = text.slice(0, 300) + "...";
        const fullText = text;

        const span = document.createElement('span');
        span.innerHTML = shortText.replace(/\n/g, '<br/>');

        const toggle = document.createElement('a');
        toggle.href = "#";
        toggle.textContent = " Read more";
        toggle.style.marginLeft = "8px";
        toggle.style.fontSize = "12px";
        toggle.style.color = sender === 'user' ? '#cceeff' : '#0078D7';
        toggle.style.cursor = 'pointer';

        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const showingShort = span.innerHTML === shortText.replace(/\n/g, '<br/>');
          span.innerHTML = (showingShort ? fullText : shortText).replace(/\n/g, '<br/>');
          toggle.textContent = showingShort ? " Read less" : " Read more";
        });

        bubble.innerHTML = '';
        bubble.appendChild(span);
        bubble.appendChild(toggle);
      }

      else {
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
