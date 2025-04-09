(() => {
  const existingIframe = document.getElementById('chatbot-iframe');
  const existingButton = document.getElementById('chatbot-toggle-btn');

  if (existingIframe || existingButton) {
    existingIframe?.remove();
    existingButton?.remove();
    window.__chatbotInjected = false;
    return;
  }

  window.__chatbotInjected = true;

  const toggleBtn = document.createElement('div');
  toggleBtn.innerText = '💬';
  toggleBtn.id = 'chatbot-toggle-btn';
  document.body.appendChild(toggleBtn);

  Object.assign(toggleBtn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    background: '#0078D7',
    color: 'white',
    borderRadius: '50%',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    zIndex: '9999'
  });

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('popup.html');
  iframe.id = 'chatbot-iframe';
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '360px',
    height: '500px',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    zIndex: '9999',
    display: 'none',
    background: '#fff', // Ensure solid white
    backdropFilter: 'none' // explicitly disable blur if any
  });

  document.body.appendChild(iframe);

  let visible = false;
  toggleBtn.addEventListener('click', () => {
    visible = !visible;
    iframe.style.display = visible ? 'block' : 'none';
  });

window.addEventListener("message", (event) => {
  if (event.data?.type === "CLOSE_CHATBOT_IFRAME") {
    document.getElementById("chatbot-iframe")?.remove();
    document.getElementById("chatbot-toggle-btn")?.remove();
    window.__chatbotInjected = false;
  }
});
})();
