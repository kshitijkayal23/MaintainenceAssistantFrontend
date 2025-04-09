import { useEffect, useState, ChangeEvent, SyntheticEvent, useRef } from "react";
import { uploadDocumentToAPI } from "../../api";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  message: string;
  timestamp: string;
  loading?: boolean;
  session: string;
}

const generateSessionId = () => `session-${Date.now()}`;

const LOCAL_STORAGE_KEY = "chat_history";

const SearchPage = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(generateSessionId());
  const [selectedApi, setSelectedApi] = useState("http://localhost:5000/query");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showDocPopup, setShowDocPopup] = useState(() => localStorage.getItem("hideDocumentInfo") !== "true");
  const [uploadedDoc, setUploadedDoc] = useState<File | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const history = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (history) {
      setChat(JSON.parse(history));
    } else {
      insertWelcomeMessage();
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chat));
  }, [chat]);

  const insertWelcomeMessage = () => {
    setChat([
      {
        id: Date.now(),
        sender: "bot",
        message: "Hello! I'm your Maintenance Assistant. Ask me anything.",
        timestamp: new Date().toLocaleTimeString(),
        session: sessionId,
      },
    ]);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    insertWelcomeMessage();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSearchChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleClearChat = () => {
    const welcome: ChatMessage = {
      id: Date.now(),
      sender: "bot",
      message: "Hello! I'm your Maintenance Assistant. Ask me anything.",
      timestamp: new Date().toLocaleTimeString(),
      session: sessionId,
    };
    setChat([welcome]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([welcome]));
  };

  const queryDynamicAPI = async (query: string) => {
    try {
      const res = await fetch(selectedApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      return await res.json();
    } catch (e) {
      return { answer: "Server error. Please try again." };
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDoc(file);
      const message = await uploadDocumentToAPI(file);
      console.log("Server response:", message);
    }
  };



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (selectedApi.includes("5000") && !uploadedDoc) {
      setChat((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          message: "Please upload required document for context.",
          timestamp: new Date().toLocaleTimeString(),
          session: sessionId,
        },
      ]);
      return;
    }

    const userMessageId = Date.now();
    const loaderId = userMessageId + 1;

    setChat((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        message: input,
        timestamp: new Date().toLocaleTimeString(),
        session: sessionId,
      },
      {
        id: loaderId,
        sender: "bot",
        message: "...",
        timestamp: "",
        loading: true,
        session: sessionId,
      },
    ]);

    const res = await queryDynamicAPI(input);
    const responseText = res.answer || "No response";

    setChat((prev) =>
      prev.map((msg) =>
        msg.id === loaderId
          ? {
            ...msg,
            message: responseText,
            timestamp: new Date().toLocaleTimeString(),
            loading: false,
          }
          : msg
      )
    );

    setInput("");
  };

  const handleToggleChange = (value: string) => {
    if (value === "document") {
      setSelectedApi("http://localhost:5000/query");
      if (localStorage.getItem("hideDocumentInfo") !== "true") {
        setShowDocPopup(true);
      }
    } else {
      setSelectedApi("http://localhost:8000/query");
    }
  };


  return (
    <div className="flex flex-col flex-grow bg-white h-[calc(100vh-60px)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-white sticky top-0 z-10">
        <div className="flex gap-3 items-center">
          <div className="relative inline-flex p-1 bg-gray-200 rounded-full text-sm font-medium">
            <button
              onClick={() => handleToggleChange("document")}
              className={`px-4 py-1 rounded-full transition-all duration-300 ${selectedApi.includes("5000")
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"
                }`}
            >
              Document Query
            </button>
            <button
              onClick={() => handleToggleChange("datasource")}
              className={`px-4 py-1 rounded-full transition-all duration-300 ${selectedApi.includes("8000")
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"
                }`}
            >
              Datasource Query
            </button>
          </div>

          {selectedApi.includes("5000") && (
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="text-sm"
            />
          )}
        </div>

        <button
          className="text-red-500 font-semibold hover:underline"
          onClick={handleClearChat}
        >
          Clear Chat
        </button>
      </div>

      {showDocPopup && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-xl p-6 rounded-xl border w-[90%] max-w-md z-50">
          <h2 className="text-lg font-semibold mb-2">Document Upload Mode</h2>
          <p className="text-sm text-gray-700 mb-4">
            In this mode, you can upload a document to improve query context and accuracy.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="hide-popup"
              onChange={(e) => {
                localStorage.setItem("hideDocumentInfo", e.target.checked.toString());
              }}
            />
            <label htmlFor="hide-popup" className="text-sm text-gray-600">
              Do not show this again
            </label>
          </div>
          <div className="flex justify-end">
            <button
              className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowDocPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2 pb-40 bg-gray-100">
        {chat.map((msg) => (
          <div key={msg.id} className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end max-w-[80%]">
              {msg.sender === "bot" && <div className="text-xl mr-2">🤖</div>}
              <div className={`relative p-3 rounded-2xl shadow-md text-sm whitespace-pre-wrap ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-900 border-l-4 border-blue-500 rounded-bl-none"}`}>
                {msg.loading ? (
                  <span className="typing-dots inline-block w-6 h-3 relative">
                    <span className="dot" />
                    <span className="dot delay-150" />
                    <span className="dot delay-300" />
                  </span>
                ) : msg.message.length > 300 && msg.sender === "bot" ? (
                  <>
                    <ExpandableText text={msg.message} />
                    <button
                      className="absolute bottom-1 right-2 text-sm text-blue-500 hover:text-blue-700"
                      title="Copy to clipboard"
                      onClick={() => copyToClipboard(msg.message)}
                    >
                      📋
                    </button>
                  </>
                ) : (
                  <>
                    {msg.message}
                    {msg.sender === "bot" && (
                      <button
                        className="absolute bottom-1 right-2 text-xs text-blue-500"
                        onClick={() => copyToClipboard(msg.message)}
                      >
                        📋
                      </button>
                    )}
                  </>
                )}
                {msg.sender === "bot" && (
                  <div className="text-[10px] mr-2 text-gray-500 self-end">{msg.timestamp}</div>
                )}
              </div>
              {msg.sender === "user" && <div className="text-xl ml-2">🧑</div>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSearchSubmit}
        className="px-4 py-3 bg-white border-t border-gray-300 flex gap-2 items-end sticky bottom-0 z-10"
      >
        <textarea
          className="flex-1 resize-none border border-gray-300 p-3 rounded-lg shadow-sm text-sm outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          placeholder="Ask something..."
          value={input}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSearchSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Send
        </button>
      </form>

      <style>
        {`
          .typing-dots {
            display: flex;
            gap: 4px;
          }
          .typing-dots .dot {
            width: 6px;
            height: 6px;
            background-color: #999;
            border-radius: 50%;
            animation: blink 1s infinite;
          }
          .typing-dots .dot.delay-150 { animation-delay: 150ms; }
          .typing-dots .dot.delay-300 { animation-delay: 300ms; }
          @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

const ExpandableText = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const shortText = text.slice(0, 300);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [expanded]);

  return (
    <div ref={contentRef}>
      <span className="whitespace-pre-wrap">
        {expanded ? text : `${shortText}...`}
      </span>
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-2 text-blue-500 text-xs underline"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
};

export default SearchPage;
