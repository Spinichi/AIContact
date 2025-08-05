import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import backgroundImage from '../assets/images/talkroom_background.png';
import homeIcon from '../assets/icons/homebtn.png';
import babyImage from '../assets/images/AIbaby.png';
import '../styles/MainPages.css';
import '../styles/TalkRoom.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { babychatapi } from '../apis/babychat';
import { apiFetch } from '../apis/fetchClient';
import type { BabychatRequest, BabychatResponse } from '../apis/babychat';
import type { ApiResponse } from '../apis/types/common';
import type { MeUserResponse } from '../apis/user/response';
import { aiChildApi } from '../apis/aiChild';

interface Message {
  text: string;
  sender: 'me' | 'ai';
  timestamp: string;
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [aiChildrenId, setAiChildrenId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);


  const [sessionId] = useState<string>(() => {
    const existing = localStorage.getItem('conversationSessionId');
    if (existing) return existing;
    const id = uuidv4();
    localStorage.setItem('conversationSessionId', id);
    return id;
  });
  
  useEffect(() => {
    aiChildApi.getMyChildren()
      .then(res => {
        if (res.success && res.data) {
      
          setAiChildrenId(res.data.id);
        }
      })
      .catch(console.error);
  }, []);

 
  useEffect(() => {
    apiFetch<ApiResponse<MeUserResponse>>('/users/me')
      .then(res => {
        if (res.success && res.data) {
          setUserId(res.data.id);
         
          setAiChildrenId((res.data as any).aiChildrenId ?? null);
        }
      })
      .catch(console.error);
  }, []);


  useEffect(() => {
    if (!userId) return;
    babychatapi.getMessages(userId)
      .then(res => {
        if (res.success && res.data) {
          const history = res.data.map((item: BabychatResponse) => ({
            text: item.reply,
            sender: 'ai' as const,
            timestamp: item.timestamp,
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

    
    const userMsg: Message = { text: input, sender: 'me', timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

   
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
          sender: 'ai',
          timestamp: res.data.timestamp,
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('GMS 호출 실패:', err);
    }

  
    setInput('');
  };

  return (
    <div className='main-layout'>
      <Sidebar />
      <div className='talkroom-content' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <img
          src={homeIcon}
          alt='홈'
          className='talkhome-icon-img'
          onClick={() => navigate('/')}
        />
        <div className='talkroom-header'>
          <div className='hashtags'>
            <span>#걱정금지</span><span>#고민해결</span>
          </div>
          <div className='title-box'><h1>포비의 고민상담소 🔮</h1></div>
        </div>
        <div className='chatroom-messages' ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-line ${msg.sender}`}>
              <div className={`chat-bubble ${msg.sender}`}> 
                {msg.text}
                <span className='timestamp'>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
        <img src={babyImage} alt='AI 아이' className='AIbaby-image' />
        <div className='chatroom-input-box'>
          <input
            type='text'
            value={input}
            placeholder='고민을 말해줘!'
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>전송</button>
        </div>
      </div>
    </div>
  );
}
