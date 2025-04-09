document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  const clearBtn = document.getElementById('clear-chat');

  // Initial greeting
  appendMessage("Hello! I'm your Maintenance Assistant. Ask me anything.", 'bot');

  input.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter' && input.value.trim()) {
      const msg = input.value.trim();
      appendMessage(msg, 'user');
      input.value = '';

      try {
        const response = await fetch("http://localhost:8000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: msg })
        });
        const result = await response.json();
        appendMessage(result.answer || 'No response', 'bot');
      } catch (err) {
        appendMessage("Error: Could not reach backend.", 'bot');
      }
    }
  });

  clearBtn.addEventListener('click', () => {
    log.innerHTML = '';
    appendMessage("Hello! I'm your Maintenance Assistant. Ask me anything.", 'bot');
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = text;
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.padding = '12px 16px';
    msgDiv.style.borderRadius = '20px';
    msgDiv.style.marginBottom = '12px';
    msgDiv.style.whiteSpace = 'pre-wrap';
    msgDiv.style.wordWrap = 'break-word';
    msgDiv.style.fontSize = '14px';
    msgDiv.style.lineHeight = '1.4';
    msgDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    msgDiv.style.display = 'inline-block';

    if (sender === 'user') {
      msgDiv.style.background = 'linear-gradient(135deg, #0078D7, #00a2ff)';
      msgDiv.style.color = 'white';
      msgDiv.style.alignSelf = 'flex-end';
      msgDiv.style.marginLeft = 'auto';
      msgDiv.style.borderBottomRightRadius = '4px';
    } else {
      msgDiv.style.background = '#e4e4e4';
      msgDiv.style.color = '#222';
      msgDiv.style.alignSelf = 'flex-start';
      msgDiv.style.marginRight = 'auto';
      msgDiv.style.borderBottomLeftRadius = '4px';
    }

    // Long message: Show more/less
    if (text.length > 300) {
      const shortText = text.slice(0, 300) + '...';
      const span = document.createElement('span');
      span.textContent = shortText;

      const toggle = document.createElement('a');
      toggle.href = '#';
      toggle.textContent = ' Show more';
      toggle.style.marginLeft = '8px';
      toggle.style.fontSize = '12px';
      toggle.style.color = sender === 'bot' ? '#0078D7' : '#fff';
      toggle.style.cursor = 'pointer';
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (span.textContent === shortText) {
          span.textContent = text;
          toggle.textContent = ' Show less';
        } else {
          span.textContent = shortText;
          toggle.textContent = ' Show more';
        }
      });

      msgDiv.textContent = '';
      msgDiv.appendChild(span);
      msgDiv.appendChild(toggle);
    }

    msgDiv.className = sender;

    log.appendChild(msgDiv);
    log.scrollTop = log.scrollHeight;
  }

  // Inject container inline styles (fallback if CSS fails)
  Object.assign(document.getElementById('chat-log').style, {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f7f7f7',
    height: '400px',
  });

  Object.assign(input.style, {
    border: '1px solid #ccc',
    padding: '12px',
    fontSize: '14px',
    width: 'calc(100% - 24px)',
    margin: '12px',
    outline: 'none',
    borderRadius: '6px'
  });

  Object.assign(clearBtn.style, {
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: 'auto',
    marginRight: '8px',
    marginTop: '6px'
  });
});
