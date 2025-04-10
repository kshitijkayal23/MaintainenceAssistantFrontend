# 🧩 Maintenance Assistant – Browser Extension

The **Maintenance Assistant Extension** is a lightweight, local-first chatbot that allows users to query asset metadata and document-based data directly from any webpage. It works in sync with your backend APIs and supports toggling between datasource and document query modes.

---

## 🌟 Features

- Toggle between **Document** and **Datasource** query modes
- Dynamically responds to user inputs using backend APIs
- Chat UI with message grouping, typing indicator, and timestamps
- Markdown + Code block support
- Expand/collapse long messages with "Read more"
- Uses environment-configurable endpoints via `config.js`
- Supports chatbot expansion and closing within an iframe

---

## 📁 Project Structure

```bash
extension/
├── popup.html         # UI container for the chatbot
├── popup.js           # Main chatbot logic
├── config.js          # Environment config (API endpoints)
├── styles.css         # Optional styling file
└── manifest.json      # Chrome extension manifest
```

---

## 🔧 Setup Instructions

### 1. Add Environment Config

Create a `config.js` file inside `extension/`:

```js
window.CONFIG = {
  METADATA_API_URL: "https://your-domain.com/query",
  DOC_QA_API_URL: "https://your-domain.com/doc-query"
};
```

This allows toggling between datasource and document APIs.

### 2. Load the Extension

1. Open **Chrome** and go to `chrome://extensions`
2. Enable **Developer Mode**
   
   ![image](https://github.com/user-attachments/assets/63fffc44-7aa8-4360-a3ca-886e680d86b6)

4. Click **"Load Unpacked"**

![image](https://github.com/user-attachments/assets/c064d56b-f118-495a-a504-23f0b3f55d2d)

6. Select the `extension/` folder

![image](https://github.com/user-attachments/assets/264d5470-cdf9-4726-ae2d-2779cc3a247d)

8. Pin it to your toolbar

![image](https://github.com/user-attachments/assets/e00f67e1-e649-4abc-b55e-a2f93aa52ddd)


---

## 📄 License

© ABB Internal Hackathon 2025
