import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/MyPage.css";
import "../styles/UserInfo.css";

import { UsersApi } from "../apis/user";
import { CouplesApi } from "../apis/couple";
import type { MeUserResponse } from "../apis/user/response";
import type { PartnerInfoResponse } from "../apis/couple/response";

const MyPage: React.FC = () => {
  const [me, setMe] = useState<MeUserResponse | null>(null);
  const [partner, setPartner] = useState<PartnerInfoResponse | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const meRes = await UsersApi.getMe();
        setMe(meRes.data);

        if (meRes.data.coupleStatus === "COUPLED") {
          const partnerRes = await CouplesApi.getPartnerInfo();
          setPartner(partnerRes.data);
        }
      } catch (error) {
        console.error("정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-content">
        <div className="mypage-header">
          <div>
            <h4># 보안 # 철저 </h4>
            <h3>마이페이지 🍀</h3>
          </div>
        </div>

        <div className="mypage-container">
          {/* 내 정보 */}
          {me && (
            <div className="mypage-card">
              <h4>내 정보</h4>
              <img
                src={me.profileImageUrl || "/profile1.png"}
                alt="내 프로필"
                className="profile-img"
              />
              <p>
                <strong>이름:</strong> {me.name}
              </p>
              <p>
                <strong>생년월일:</strong> {me.birthDate || "정보 없음"}
              </p>
              <p>
                <strong>이메일:</strong> {me.email}
              </p>
              <p>
                <strong>연인코드:</strong>{" "}
                {me.coupleId ? `${me.coupleId}` : "없음"}
              </p>
              <button className="useredit-btn">수정</button>
              <button className="danger-btn">회원 탈퇴</button>
            </div>
          )}

          {/* 연인 정보 */}
          {partner && (
            <div className="mypage-card">
              <h4>연인 정보</h4>
              <img
                src={partner.profileImageUrl || "/profile2.png"}
                alt="연인 프로필"
                className="profile-img"
              />
              <p>
                <strong>이름:</strong> {partner.name}
              </p>
              <p>
                <strong>생년월일:</strong> {partner.birthDate || "정보 없음"}
              </p>
              <p>
                <strong>이메일:</strong> {partner.email}
              </p>
              <button className="danger-btn">커플 연결 해제</button>
            </div>
          )}

          {/* 아이 정보 */}
          <div className="mypage-card">
            <h4>아이 정보</h4>
            <img src="/child.png" alt="아이 프로필" className="profile-img" />
            <p>
              <strong>이름:</strong> 김포비
            </p>
            <p>
              <strong>생년월일:</strong> 2025년 7월 27일
            </p>
            <button className="useredit-btn">수정</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
