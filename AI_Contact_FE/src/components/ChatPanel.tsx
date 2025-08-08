import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { ChatApi } from "../apis/chat/api";
import '../styles/ChatPanel.css';
import { CouplesApi } from "../apis/couple/api";

interface ChatPanelProps {
  coupleId: number;
  senderId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  senderId: number;
  content: string;
  messageType: "TEXT";
  sentAt: string;
}

export default function ChatPanel({ coupleId, senderId, isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const stompClientRef = useRef<any>(null);
  const socketRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const myId = Number(senderId);
  if (!Number.isFinite(myId)) {
    return null;
  }

  const isBlank = input.trim().length === 0;

  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const res = await CouplesApi.getPartnerInfo();
        const partner = (res as any)?.data ?? res;
        setPartnerAvatarUrl(partner?.profileImageUrl ?? null);
      } catch (err) {
        console.error("파트너 정보 불러오기 실패:", err);
      }
    };

    fetchPartnerInfo();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await ChatApi.getMessages(coupleId);
        const list = res?.data ?? res;
        if (!Array.isArray(list)) return;

        const normalized = list.map((m: any) => {
          const sid =
            m.senderId ?? m.sender_id ??
            m.userId ?? m.user_id ??
            m.writerId ?? m.writer_id ??
            m.sender?.id ?? m.user?.id;

          const nSid = Number(sid);

          return {
            senderId: Number.isFinite(nSid) ? nSid : -1,
            content: String(m.content ?? m.message ?? m.text ?? ""),
            messageType: "TEXT" as const,
            sentAt: m.sentAt ?? m.sent_at ?? m.createdAt ?? m.created_at ?? new Date().toISOString(),
          };
        });

        setMessages(normalized);
      } catch (e) {
        console.error("메시지 히스토리 로드 실패:", e);
      }
    })();
  }, [coupleId]);

  
  useEffect(() => {
    const socket = new SockJS("/api/v1/ws-chat");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/sub/chat/${coupleId}`, (message: any) => {
        const raw = JSON.parse(message.body);
        const payload: Message = {
          senderId: Number(raw.senderId),
          content: String(raw.content ?? ""),
          messageType: "TEXT",
          sentAt: raw.sentAt ?? new Date().toISOString(),
        };
        setMessages((prev) => [...prev, payload]);
      });

      stompClientRef.current = stompClient;
      socketRef.current = socket;
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [coupleId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  
  const sendMessage = () => {
    const stompClient = stompClientRef.current;
    const text = input.trim();
    if (!text) return;

    if (!stompClient || !stompClient.connected) {
      return;
    }

    const chatMessage = {
      coupleId: coupleId,
      senderId: senderId,
      content: input.trim(),
      sentAt: new Date().toISOString(),
    };

    stompClient.send("/pub/chat/sendMessage", {}, JSON.stringify(chatMessage));
    setInput("");
  };

  const formatTime = (sentAt: string) => {
    try {
      const date = new Date(sentAt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? '오후' : '오전';
      const displayHours = hours % 12 || 12;
      return `${ampm} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/default-avatar.png";
  };

  return (
    <div className={`chat-panel ${isOpen ? "open" : ""}`}>
      <div className="chat-header">
        <span>채팅</span>
        <button onClick={onClose}>닫기</button>
      </div>

      <div className="chat-messages" ref={messagesEndRef}>
        {messages.map((msg, idx) => {
          const mine = msg.senderId === myId;
          return (
            <div key={idx} className={`message-row ${mine ? "right" : "left"}`}>
              {!mine && (
                <img
                  className="avatar"
                  src={partnerAvatarUrl || "/images/default-avatar.png"}
                  alt="상대 프로필"
                  onError={handleImageError}
                />
              )}
              <div className={`message-container ${mine ? "right" : "left"}`}>
                <div className={`message ${mine ? "from-me" : "from-you"}`}>
                  {msg.content}
                </div>
                <div className="message-time">
                  {formatTime(msg.sentAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!isBlank) sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isBlank}
          title={isBlank ? "메시지를 입력하세요" : ""}
        >
          전송
        </button>
      </div>
    </div>
  );
}