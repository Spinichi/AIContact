// MainPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import BabyAvatar from "../components/BabyAvatar";
import ChatPanel from "../components/ChatPanel";
import EventCalendar from "../components/MainEventCalendar";
import RightIcons from "../components/RightIcons";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/UserInfo.css";

import { CouplesApi } from "../apis/couple";
import type {
  CoupleInfoResponse,
  PartnerInfoResponse,
} from "../apis/couple/response";
import { dailySchedulesApi } from "../apis/dailySchedule";
import type { DailyScheduleResponse } from "../apis/dailySchedule/response";
import { UsersApi } from "../apis/user/api";
import type { MeUserResponse } from "../apis/user/response";

export default function MainPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<MeUserResponse | null>(null);
  const [partner, setPartner] = useState<PartnerInfoResponse | null>(null);
  const [coupleMeta, setCoupleMeta] = useState<CoupleInfoResponse | null>(null);
  const [dDay, setDday] = useState<DailyScheduleResponse[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [meRes, ddayRes] = await Promise.all([
          UsersApi.getMe(),
          dailySchedulesApi.getSchedulesDday(),
        ]);

        if (cancelled) return;

        setUserInfo(meRes.data);
        setDday(ddayRes.data);

        if (meRes.data?.coupleId) {
          try {
            const [partnerRes, coupleRes] = await Promise.all([
              CouplesApi.getPartnerInfo(),
              CouplesApi.getCoupleInfo(),
            ]);
            if (cancelled) return;
            setPartner(partnerRes.data);
            setCoupleMeta(coupleRes.data);
          } catch {
            setPartner(null);
            setCoupleMeta(null);
          }
        } else {
          setPartner(null);
        }
      } catch (e) {
        console.error("[MainPage] fetch failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && userInfo && !partner) {
      navigate("/connection", { replace: true });
    }
  }, [loading, userInfo, partner, navigate]);

  const loveDays = useMemo(() => {
    if (!coupleMeta?.startDate) return null;
    try {
      const start = new Date(coupleMeta.startDate);
      const today = new Date();
      const diff = Math.floor(
        (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
          Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
          (1000 * 60 * 60 * 24)
      );
      return diff + 1;
    } catch {
      return null;
    }
  }, [coupleMeta?.startDate]);

  if (loading) return <div>로딩 중...</div>;
  if (!userInfo)
    return <div>세션이 만료되었거나 사용자 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4>
            {userInfo.name}
            {partner?.name ? ` 💗 ${partner.name}` : ""}
          </h4>
          <h3>
            사랑한지 <span>{loveDays ?? 87}일</span> 째
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
