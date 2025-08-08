import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { ChatApi } from "../apis/chat/api";

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

export default function ChatPanel({ coupleId, senderId }: ChatPanelProps) {
 
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const stompClientRef = useRef<any>(null);
  const socketRef = useRef<any>(null);

  const myId = Number(senderId); 
  if (!Number.isFinite(myId)) {
    
    return null; 
  }

  const isBlank = input.trim().length === 0;

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

        console.log('history mapped sample:', normalized.slice(0, 3));
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
        stompClientRef.current.disconnect(() => {
         
        });
      }
    };
  }, [coupleId]);

  
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

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <b>{msg.senderId === myId ? "나" : "상대"}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1 }}
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
          style={isBlank ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
        >
          전송
        </button>
      </div>
    </div>
  );
}