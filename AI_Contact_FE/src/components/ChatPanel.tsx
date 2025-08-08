import React, { useState } from "react";
import "../styles/ChatPanel.css";

// 부모한테 받을 props 타입 정의
interface ChatPanelProps {
  isOpen: boolean; // 패널 열림 여부 (true면 오른쪽에서 슬라이드로 쨘 나옴)
  onClose: () => void; // 닫기 버튼하면 사라진다
}

// 메세지 타입 정의
interface Message {
  text: string; // 메세지 내용
  sender: "me" | "you"; // 보낸 사람 나랑 너임
}

// 컴포넌트 정의
const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  // 입력창 상태 (input에 입력 중인 텍스트 저장하는 거임)
  const [input, setInput] = useState("");

  // 채팅 메세지 배열(기본 메세지 2개 일단 정해놓고 확인할라고 넣은 거임 뺴도 댐)
  const [messages, setMessages] = useState<Message[]>([
    { text: "하이티비!", sender: "me" },
    { text: "ㅇㅇ ㅎㅇ?", sender: "you" },
  ]);

  // 엔터나 전송버튼 누르면 실행되는 함수임
  const handleSend = () => {
    // input.trim()은 사용자가 입력한 문자열에서 앞뒤 공백 제거해주는 함수
    if (!input.trim()) return; // 공백만 있으면 전송안되게 해둠
    // 내가 입력한 메세지 배열에 추가
    // setMessages는 상태 업데이트 함수, prev는 이전 메세지 배열임
    // text: input은 현재 입력한 내용
    // sender: "me"는 내가 전송한 메세지
    setMessages((prev) => [...prev, { text: input, sender: "me" }]);
    // 보내고 나면 초기화 시키기
    setInput("");

    // AI가 가짜로 일단 대답해줌 0.5초 뒤에 자동 전송하게 만듦
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "뭐해?", sender: "you" }]);
    }, 500);
  };

  return (
    // 슬라이드 패널 컨테이너 (isOpen이 true면 .open 클래스 -> right:0 해둔 거)
    <div className={`chat-panel ${isOpen ? "open" : ""}`}>
      <div className="chat-header">
        <span>채팅</span>
        <button onClick={onClose}>✖</button>
      </div>
      {/* 말풍선 쌓이는 영역임 */}
      <div className="chat-messages">
        {/* 메세지 배열 map 돌면서 하나씩 출력 
        .map((msg, idx) => ...) 는 배열의 각 msg를 꺼내서 div 태그로 바꿔줌*/}
        {messages.map((msg, idx) => (
          <div
            key={idx} // key={idx}는 반복 렌더링할 때, 각 요소를 구분하기 위한 고유 키
            className={`message ${
              msg.sender === "me" ? "from-me" : "from-you"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 채팅 입력창 */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="메세지 입력"
          value={input} //현재 입력 상태와 연결됨
          onChange={(e) => setInput(e.target.value)} // 입력할 때마다 상태 업데이트
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(); // 엔터로 전송하기
          }}
        />
        <button onClick={handleSend}>전송</button>{" "}
        {/* 버튼 클릭해도 전송 가능 */}
      </div>
    </div>
  );
};

export default ChatPanel;
