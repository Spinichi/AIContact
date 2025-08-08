import { useEffect, useState } from 'react';
import BabyAvatar from '../components/BabyAvatar';
import ChatPanel from '../components/ChatPanel';
import EventCalendar from '../components/MainEventCalendar';
import RightIcons from '../components/RightIcons';
import Sidebar from '../components/Sidebar';
import '../styles/MainPages.css';
import '../styles/UserInfo.css';

import { UsersApi } from '../apis/user/api';
import type { MeUserResponse } from '../apis/user/response';
import type { DailyScheduleResponse } from '../apis/dailySchedule/response';
import { dailySchedulesApi } from '../apis/dailySchedule';

export default function MainPage() {
  const [userInfo, setUserInfo] = useState<MeUserResponse | null>(null);
  const [dDay, setDday] = useState<DailyScheduleResponse[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await UsersApi.getMe();
        const dday = await dailySchedulesApi.getSchedulesDday();
        setUserInfo(res.data);
        setDday(dday.data);
      } catch (err) {
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) return <div>로딩 중...</div>;

  return (
    <div className="main-layout">
      <Sidebar />
      <div className='main-content'>
        <div className="mainpage-header">
          <p><span className="mainpage-label">{userInfo.name} 💗</span></p>
          <h3>사랑한지 <strong>87일</strong> 째</h3> 
        </div>

        <div className='content-row'>
          <BabyAvatar />
          <EventCalendar data={dDay}/>
          <RightIcons onChatClick={() => setIsChatOpen(true)} />
        </div>

        {userInfo.coupleId && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            coupleId={userInfo.coupleId}
            senderId={userInfo.id}
          />
        )}
      </div>
    </div>
  );
}
