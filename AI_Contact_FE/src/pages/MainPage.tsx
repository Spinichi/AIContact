import '../styles/MainPages.css';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BabyAvatar from '../components/BabyAvatar';
import RightIcons from '../components/RightIcons';

import ChatPanel from '../components/ChatPanel';
import '../styles/UserInfo.css';
import EventCalendar from './MainEventCalendar';

export default function MainPage() {
  // 채팅창 열기/닫기 상태 선언
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className='main-layout'>
      <Sidebar />

      <div className='main-content'>
        <div className="mainpage-header">
          <p><span className="mainpage-label">지민 💗 재욱</span></p>
          <h3>사랑한지 <strong>87일</strong> 째</h3>
        </div>

        <div className='content-row'>

        <BabyAvatar />
        <EventCalendar />
        <RightIcons onChatClick={() => setIsChatOpen(true)} />
        </div>

        
        {/* 채팅 패널 */}
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}
