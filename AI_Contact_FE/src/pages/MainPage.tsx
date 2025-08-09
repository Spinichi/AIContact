import { useEffect, useState } from "react";
import BabyAvatar from "../components/BabyAvatar";
import ChatPanel from "../components/ChatPanel";
import EventCalendar from "../components/MainEventCalendar";
import RightIcons from "../components/RightIcons";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/UserInfo.css";

import { CouplesApi } from "../apis/couple";
import type { PartnerInfoResponse } from "../apis/couple/response";
import { dailySchedulesApi } from "../apis/dailySchedule";
import type { DailyScheduleResponse } from "../apis/dailySchedule/response";
import { UsersApi } from "../apis/user/api";
import type { MeUserResponse } from "../apis/user/response";

export default function MainPage() {
  const [userInfo, setUserInfo] = useState<MeUserResponse | null>(null);
  const [coupleInfo, setCoupleInfo] = useState<PartnerInfoResponse | null>(
    null
  );
  const [dDay, setDday] = useState<DailyScheduleResponse[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const [meRes, ddayRes] = await Promise.all([
          UsersApi.getMe(),
          dailySchedulesApi.getSchedulesDday(),
        ]);

        setUserInfo(meRes.data);
        setDday(ddayRes.data);

        if (meRes.data.coupleId) {
          const partnerRes = await CouplesApi.getPartnerInfo();
          setCoupleInfo(partnerRes.data);
        }
      } catch (err) {}
    };
    fetchUserInfo();
  }, []);

  if (!userInfo || !coupleInfo) return <div>로딩 중...</div>;

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4>
            {userInfo.name}
            {coupleInfo && ` 💗 ${coupleInfo.name}`}
          </h4>
          <h3>
            사랑한지 <strong>87일</strong> 째
          </h3>
        </div>
        <div className="content-row">
          <BabyAvatar />
          <EventCalendar data={dDay} />
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
