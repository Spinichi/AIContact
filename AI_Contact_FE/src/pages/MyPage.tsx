import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/MyPage.css"; // 마이페이지 전용 CSS 파일을 따로 만들자
import "../styles/UserInfo.css"

const MyPage: React.FC = () => {
  return (
    <div className="main-layout">
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 */}
      <div className="main-content">
        <div className="mypage-header">
          <div>

            <h4># 보안 # 철저 </h4>
            <h3>마이페이지 🍀</h3>
          </div>
        </div>

        {/* 본문 */}
        <div className="mypage-container">
          {/* 내 정보 */}
          <div className="mypage-card">
            <h4>내 정보</h4>
            <img src="/profile1.png" alt="내 프로필" className="profile-img" />
            <p><strong>이름:</strong> 이종석</p>
            <p><strong>생년월일:</strong> 1989년 9월 14일</p>
            <p><strong>이메일:</strong> lee123@ssafy.com</p>
            <p><strong>연인코드:</strong> sla3fghiy</p>
            <button className="useredit-btn">수정</button>
            <button className="danger-btn">회원 탈퇴</button>
          </div>

          {/* 연인 정보 */}
          <div className="mypage-card">
            <h4>연인 정보</h4>
            <img src="/profile2.png" alt="연인 프로필" className="profile-img" />
            <p><strong>이름:</strong> 이지은</p>
            <p><strong>생년월일:</strong> 1993년 5월 16일</p>
            <p><strong>이메일:</strong> jjj567@ssafy.com</p>
            <button className="danger-btn">커플 연결 해제</button>
          </div>

          {/* 아이 정보 */}
          <div className="mypage-card">
            <h4>아이 정보</h4>
            <img src="/child.png" alt="아이 프로필" className="profile-img" />
            <p><strong>이름:</strong> 김포비</p>
            <p><strong>생년월일:</strong> 2025년 7월 27일</p>
            <button className="useredit-btn">수정</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
