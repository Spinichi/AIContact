import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/MyPage.css";
import "../styles/UserInfo.css";

import { useNavigate } from "react-router-dom";
import { CouplesApi } from "../apis/couple";
import type { PartnerInfoResponse } from "../apis/couple/response";
import { UsersApi } from "../apis/user";
import type { MeUserResponse } from "../apis/user/response";

const MyPage: React.FC = () => {
  const [me, setMe] = useState<MeUserResponse | null>(null);
  const [partner, setPartner] = useState<PartnerInfoResponse | null>(null);
  const navigate = useNavigate();

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
          <h4># 보안 # 철저 </h4>
          <h3>마이페이지 🍀</h3>
        </div>

        <div className="mypage-container">
          <div>
            {/* 내 정보 */}
            {me && (
              <div className="mypage-card-wrapper">
                <h4>내 정보</h4>
                <div className="mypage-card">
                  <div className="mypage-card-section-wrapper">
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">이름</div>
                      <div className="mypage-card-section-value">{me.name}</div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">프로필사진</div>
                      <div className="mypage-card-section-value">
                        <img
                          src={me.profileImageUrl || "/profile1.png"}
                          alt="내 프로필"
                          className="profile-img"
                        />
                      </div>
                      <div className="mypage-card-section-btn">
                        <button className="useredit-btn">수정</button>
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">생년월일</div>
                      <div className="mypage-card-section-value">
                        {me.birthDate}
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">이메일</div>
                      <div className="mypage-card-section-value">
                        {me.email}
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">비밀번호</div>
                      <div className="mypage-card-section-value">
                        **********
                      </div>
                      <div className="mypage-card-section-btn">
                        <button className="useredit-btn">수정</button>
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">연인코드</div>
                      <div className="mypage-card-section-value">
                        {me.coupleId ? `${me.coupleId}` : "없음"}
                      </div>
                    </div>
                  </div>
                  <div className="danger-btn-wrapper">
                    <button className="danger-btn">회원 탈퇴</button>
                  </div>
                </div>
              </div>
            )}

            {/* 연인 정보 */}
            {partner && (
              <div className="mypage-card-wrapper">
                <h4>연인 정보</h4>
                <div className="mypage-card">
                  <div className="mypage-card-section-wrapper">
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">이름</div>
                      <div className="mypage-card-section-value">
                        {partner.name}
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">프로필사진</div>
                      <div className="mypage-card-section-value">
                        <img
                          src={partner.profileImageUrl || "/profile2.png"}
                          alt="연인 프로필"
                          className="profile-img"
                        />
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">생년월일</div>
                      <div className="mypage-card-section-value">
                        {partner.birthDate}
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">이메일</div>
                      <div className="mypage-card-section-value">
                        {partner.email}
                      </div>
                    </div>
                  </div>
                  <div className="danger-btn-wrapper">
                    <button
                      className="danger-btn"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "커플 연결을 해제하면 모든 데이터가 삭제됩니다.\n정말 해제하시겠습니까?"
                        );
                        if (!confirmed) return;

                        try {
                          await CouplesApi.deleteCouple();
                          alert("커플 연결이 해제되었습니다.");
                          navigate("/connection");
                        } catch (e) {
                          console.error(e);
                          alert("연결 해제 중 오류가 발생했습니다.");
                        }
                      }}
                    >
                      커플 연결 해제
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 아이 정보 */}
            <div className="mypage-card-wrapper">
              <h4>아이 정보</h4>
              <div className="mypage-card">
                <div className="mypage-card-section-wrapper">
                  <div className="mypage-card-section">
                    <div className="mypage-card-section-name">이름</div>
                    <div className="mypage-card-section-value">김포비</div>
                    <div className="mypage-card-section-btn">
                      <button className="useredit-btn">수정</button>
                    </div>
                  </div>
                  <div className="mypage-card-section">
                    <div className="mypage-card-section-name">프로필사진</div>
                    <div className="mypage-card-section-value">
                      <img
                        src="/child.png"
                        alt="아이 프로필"
                        className="profile-img"
                      />
                    </div>
                  </div>
                  <div className="mypage-card-section">
                    <div className="mypage-card-section-name">생년월일</div>
                    <div className="mypage-card-section-value">
                      2025년 7월 27일
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
