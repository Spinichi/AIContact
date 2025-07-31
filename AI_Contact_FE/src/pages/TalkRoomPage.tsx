import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import backgroundImage from '../assets/images/talkroom_background.png';
import homeIcon from '../assets/icons/homebtn.png';

import '../styles/MainPages.css';
import '../styles/TalkRoom.css';
import { useNavigate } from 'react-router-dom';
import babyImage from '../assets/images/AIbaby.png';

interface Message {
  text: string;
  sender: 'me' | 'ai';
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    // 내 메시지 추가
    setMessages((prev) => [...prev, { text: input, sender: 'me' }]);

    // AI 메시지 테스트용 자동 응답 추가
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'AI가 대답했어 😊', sender: 'ai' }
      ]);
    }, 500);

    setInput('');
  };

  return (
    <div className='main-layout'>
      <Sidebar />

      <div
        className='talkroom-content'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img
          src={homeIcon}
          alt='홈'
          className='home-icon-img'
          onClick={() => navigate('/')}
        />

        <div className='talkroom-header'>
          <div className='hashtags'>
            <span>#걱정금지</span>
            <span>#고민해결</span>
          </div>
          <div className='title-box'>
            <h1>포비의 고민상담소 🔮</h1>
          </div>
        </div>

        {/* 채팅영역 */}
        <div className='chatroom-messages'>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.sender}`}
            >
            <div className={`chat-bubble ${msg.sender}`}>

              {msg.text}
            </div>
            </div>
          ))}
        </div>

        <img src={babyImage} alt='AI 아이' className='AIbaby-image' />

        {/* 입력창 */}
        <div className='chatroom-input-box'>
          <input
            type='text'
            value={input}
            placeholder='고민을 말해줘!'
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>전송</button>
        </div>
      </div>
    </div>
  );
}
