# 🧠 Maintenance Assistant Frontend (React + Vite + TypeScript)

This project is the **frontend UI client** for the APM-RAG-based Maintenance Assistant system, built using **React**, **Vite**, and **TypeScript**. It connects to a Flask-based backend that handles document upload, embedding, and natural language query capabilities.

---

## ⚙️ Run the Application

### 1. Clone the Repository

```bash
git clone https://github.com/kshitijkayal23/MaintainenceAssistantFrontend
cd MaintainenceAssistantFrontend/frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages.

---

### 3. Environment Configuration

Create a `.env` file in the root directory of the frontend and add the following variable:

```env
METADATA_API_URL= "http://10.140.56.117:8000/query"
DOC_QA_API_URL= "http://10.140.56.117:8001/doc-query"
DOC_UPLOAD_API_URL= "http://10.140.56.117:8001/doc-upload"
```

This allows the React app to communicate with the Flask backend locally.

---

### 4. Start the Development Server

```bash
npm run dev
```

This will open the frontend app in your default browser (typically at `http://localhost:5173`).

---

## 🌐 API Endpoints Used

This frontend integrates with two primary endpoints from the backend:

### 📄 `/doc-upload`

- Allows users to upload **PDF documents** or **content URLs**.
- Backend reads content, splits it into chunks, and generates embeddings for semantic search.

### ❓ `/doc-query`

- Accepts **natural language questions**.
- Returns the most contextually relevant document snippets using vector similarity search from stored embeddings.

### ❓ `/query`

- Accepts **natural language questions**.
- Returns the asset information from timescale database using llm.

---

## 🧹 About the UI Client

This React frontend provides a user-friendly interface to:

- Upload documentation for context-aware question answering.
- Ask queries in simple English and get intelligent responses based on embedded content.
- Handle PDF uploads, display processing status, and return answers in a structured format.
- Ensure offline-compatible, efficient user experience in industrial or enterprise environments.

---

## 🚀 Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Backend
- [Flask Backend- doc-query (external)](https://github.com/PrabhatMauryaAbb/Hackathon-RAG)
- [Flask Backend- query (external)](https://github.com/durgeshjnv2010/BYOP)

---

## Team members-

- Prabhat Maurya
- Durgesh Kumar
- Akshita Choudhury
- Kshitij Kayal
- Bhennett Mithran
- Sakthi Sowmya S

---

## 📄 License

MIT License © 2024

Developed by ABB - BYOP



