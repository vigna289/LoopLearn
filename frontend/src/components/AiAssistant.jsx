import { useState } from "react";
import axios from "axios";
import "./AiAssistant.css";

const AiAssistant = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question) return;

    setLoading(true);
    setAnswer("");

try {
    const res = await fetch("http://127.0.0.1:8000/api/ai/ask/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    setAnswer(data.answer);
  } catch (err) {
    setAnswer("AI is currently unavailable");
  }
};

  return (
    <>
      {/* Floating Button */}
      <div className="ai-fab" onClick={() => setOpen(true)}>
        🤖
      </div>

      {/* Popup */}
      {open && (
        <div className="ai-modal">
          <div className="ai-header">
            <span>SkillBarter AI Help</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="ai-body">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={askAI} disabled={loading}>
              {loading ? "Thinking..." : "Ask"}
            </button>

            {answer && <p className="ai-answer">{answer}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
