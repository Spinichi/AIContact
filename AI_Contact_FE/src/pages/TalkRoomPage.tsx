import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { aiChildApi } from "../apis/aiChild";
import type {
  AiMessageType,
  BabychatRequest,
  BabychatResponse,
} from "../apis/babychat";
import { babychatapi } from "../apis/babychat";
import { apiFetch } from "../apis/fetchClient";
import type { ApiResponse } from "../apis/types/common";
import type { MeUserResponse } from "../apis/user/response";
import babyImage from "../assets/images/AIbaby.png";
import backgroundImage from "../assets/images/talkroom_background.png";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/TalkRoom.css";
import { generateLetter, canGenerateToday, remainText } from "../apis/letter/generate";

/**
 * ============================
 *  COOLDOWN UI SWITCH (주석 토글)
 * ============================
 * 쿨타임 UI/가드 켜기 → 아래 true 라인 사용
 * 쿨타임 UI/가드 끄기 → 아래 false 라인 사용 (기본)
 */
const COOLDOWN_UI_ENABLED = true;   // ← ON
// const COOLDOWN_UI_ENABLED = false;      // ← OFF (기본)

interface Message {
  text: string;
  sender: "me" | "ai";
  timestamp: string;
  aiMessageType: AiMessageType;
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [aiChildrenId, setAiChildrenId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // 생성 버튼
  const [generating, setGenerating] = useState(false);

  const [sessionId] = useState<string>(() => {
    const existing = localStorage.getItem("conversationSessionId");
    if (existing) return existing;
    const id = uuidv4();
    localStorage.setItem("conversationSessionId", id);
    return id;
  });

  useEffect(() => {
    aiChildApi
      .getMyChildren()
      .then((res) => {
        if (res.success && res.data) {
          setAiChildrenId(res.data.id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    apiFetch<ApiResponse<MeUserResponse>>("/users/me")
      .then((res) => {
        if (res.success && res.data) {
          setUserId(res.data.id);
          setAiChildrenId((res.data as any).aiChildrenId ?? null);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!userId) return;
    babychatapi
      .getMessages(userId)
      .then((res) => {
        if (res.success && res.data) {
          const history = res.data.map((item: BabychatResponse) => ({
            text: item.reply,
            sender: "ai" as const,
            timestamp: item.timestamp,
            aiMessageType: item.aiMessageType,
          }));
          setMessages(history);
        }
      })
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || userId == null || aiChildrenId == null) return;

    const userMsg: Message = {
      text: input,
      sender: "me",
      timestamp: new Date().toISOString(),
      aiMessageType: "USER",
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const payload: BabychatRequest = {
        userId,
        aiChildrenId,
        conversationSessionId: sessionId,
        message: input,
      };
      const res = await babychatapi.sendMessage(payload);

      if (res.success && res.data) {
        const aiMsg: Message = {
          text: res.data.reply,
          sender: "ai",
          timestamp: res.data.timestamp,
          aiMessageType: res.data.aiMessageType,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error("GMS 호출 실패:", err);
    }

    setInput("");
  };

  const handleGenerateLetter = async () => {
    if (generating) return;
    if (!userId) return;

    // COOLDOWN UI/가드: 스위치가 ON일 때만 검사
    if (COOLDOWN_UI_ENABLED && !canGenerateToday(userId)) {
      alert(`다음 생성까지 ${remainText(userId)} 남았어요.`);
      return;
    }

    setGenerating(true);
    const r = await generateLetter({ timeoutMs: 6500, userId });
    setGenerating(false);

    if (r.ok) {
      alert("편지를 보냈어요! 📮 상대방 편지함에서 확인할 수 있어요.");
    } else if (r.reason === "no-token") {
      alert("로그인이 필요합니다.");
    } else if (r.reason === "cooldown") {
      // UI 스위치가 OFF여도 generate.ts에서 COOLDOWN_ENABLED가 ON이면 여기로 들어올 수 있음
      alert(`다음 생성까지 ${remainText(userId)} 남았어요.`);
    } else {
      alert("편지 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div
        className="talkroom-content"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="back-ai" onClick={() => navigate("/ai")}>
          ←
        </div>
        <div className="page-header page-header-light">
          <h4># 걱정금지 # 고민해결</h4>
          <h3>고민상담소 🔮</h3>
        </div>

        <div className="chatroom-messages" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-line ${msg.aiMessageType}`}>
              <div className={`chat-bubble ${msg.aiMessageType}`}>
                {msg.text}
              </div>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
        <img src={babyImage} alt="AI 아이" className="AIbaby-image" />
        <div className="chatroom-input-box">
          <input
            type="text"
            value={input}
            placeholder="고민을 말해줘!"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        <button onClick={handleSend}>전송</button>
        <button
          onClick={handleGenerateLetter}
          disabled={
            generating ||
            !userId 
            // (COOLDOWN_UI_ENABLED && !canGenerateToday(userId))
          }
        >
          {generating ? "생성 중..." : "편지 생성"}
        </button>
        </div>
      </div>
    </div>
  );
}
