import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BabyAvatar from "../components/BabyAvatar";
import ChatPanel from "../components/ChatPanel";
import EventCalendar from "../components/MainEventCalendar";
import RightIcons from "../components/RightIcons";
import Sidebar from "../components/Sidebar";
import Loading from "../components/animations/Loading";
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

// ✅ 추가: 아이 정보 API/타입 임포트
import { aiChildApi } from "../apis/aiChild";
import type { AiChildResponse } from "../apis/aiChild/response";

export default function MainPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<MeUserResponse | null>(null);
  const [partner, setPartner] = useState<PartnerInfoResponse | null>(null);
  const [coupleMeta, setCoupleMeta] = useState<CoupleInfoResponse | null>(null);
  const [dDay, setDday] = useState<DailyScheduleResponse[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ 추가: 아이 상태 관리
  const [child, setChild] = useState<AiChildResponse | null>(null);

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

          // ✅ 추가: 커플 상태라면 아이 정보도 조회
          try {
            const childRes = await aiChildApi.getMyChildren();
            if (!cancelled) setChild(childRes.data);
          } catch (e) {
            // 아이가 아직 없을 수 있음 → 조용히 무시하고 null 유지
            if (!cancelled) setChild(null);
          }
        } else {
          setPartner(null);
          setChild(null); // ✅ 커플이 아니면 아이 정보 없음
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

  return (
    <div className="main-layout">
      {loading ? <Loading /> : <></>}
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4>
            {userInfo?.name}
            {partner?.name ? ` 💗 ${partner.name}` : ""}
          </h4>
          <h3>
            사랑한지 <span>{loveDays ?? 87}일</span> 째
          </h3>
        </div>

        <div className="content-row">
          <EventCalendar data={dDay} />
          <BabyAvatar
            name={child?.name || "이름 없음"}
            imageUrl={child?.imageUrl || "Ai.png"}
          />

          <div className="baby-stats">
            <div>
              나이 👼🏻
              <div className="baby-stats-content">
                {child ? `${Math.floor(child.experiencePoints / 100)}살` : "-"}
              </div>
            </div>
            <div>
              <div className="baby-stats-content-wrapper">
                <div>친밀도 💘</div>
                <div className="baby-stats-content-bar-percent">
                  {child ? `${child.experiencePoints % 100} / 100` : "- / 100"}
                </div>
              </div>
              <div className="baby-stats-content-bar">
                <div
                  className="baby-stats-content-bar-fill"
                  style={{
                    width: `${child ? child.experiencePoints % 100 : 0}%`,
                  }}
                />
              </div>
              {/* 수치 표시 */}
            </div>
          </div>
        </div>

        <RightIcons onChatClick={() => setIsChatOpen((v) => !v)} />

        {userInfo?.coupleId && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            coupleId={userInfo?.coupleId}
            senderId={userInfo?.id}
          />
        )}
      </div>
    </div>
  );
}
