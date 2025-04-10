# 🧩 Maintenance Assistant by Team BYOP

Welcome to the **Maintenance Assistant** React application!  
This UI provides an intuitive interface to interact with the backend AI assistant for document understanding, query support, and smart recommendations.

---

# 🛠️ Maintenance Assistant Chat Browser

This is a full-featured web-based chatbot interface for interacting with maintenance data via document or datasource queries.

## 🔧 Tech Stack

- React + TypeScript
- TailwindCSS
- Vite
- Flask (Backend API)

## 📦 Features

- Sidebar with chat session history (create, rename, delete)
- Toggle between **Document Query** and **Datasource Query**
- PDF Document Upload
- Expandable bot messages (Read More / Read Less)
- Auto-scroll, typing animation
- Persistent sessions via LocalStorage
- Environment variable support (`.env`)

## 🧪 Environment Setup

Create a `.env` file in the `frontend/` root:

```
VITE_METADATA_API_URL=https://<your-domain>:8000/query
VITE_DOC_QA_API_URL=https://<your-domain>:8001/doc-query
VITE_DOC_UPLOAD_API_URL=https://<your-domain>:8001/doc-upload
```

> Ensure your backend is served over HTTPS to prevent mixed content issues.

## 🚀 Run the App

```bash
cd frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173/search`

## 📝 To Do

- WebSocket support for streaming
- Chunked document upload display
- Copy-to-clipboard for answers
- Authentication & security

## 2. Local Browser Extension

# 🧩 Maintenance Assistant Browser Extension

This is a lightweight Chrome Extension for chatting with your Maintenance Assistant chatbot in a popup window.

## 📦 Features

- Toggle between Document and Datasource queries
- Interactive chat with expandable answers
- Clear chat, expand info, close popup
- Chat tail styling and timestamps
- Auto-scroll to latest message

## ⚙️ Setup `config.js`

Create a `config.js` in the `extension/` folder:

```js
const CONFIG = {
  METADATA_API_URL: "https://<your-domain>:8000/query",
  DOC_QA_API_URL: "https://<your-domain>:8001/doc-query"
};
```

## 🧪 Load Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer Mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

Click the extension icon in the toolbar to start chatting.

## ⚠️ Note on HTTPS

If your frontend (e.g., APM) is loaded via HTTPS, backend APIs **must** also use HTTPS. Otherwise, Chrome will block the requests.

## 📝 To Do

- Upload support if needed
- WebSocket integration
- Toolbar badge notification for unread messages
---
## Team members-

- Prabhat Maurya
- Durgesh Kumar
- Akshita Choudhury
- Kshitij Kayal
- Bhennett Mithran
- Sakthi Sowmya S
---
