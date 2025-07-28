import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/DictionaryPage.css";

const DictionaryPage: React.FC = () => {
  return (
    <div className="main-layout">
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        {/* 상단 헤더 */}
        <div className="user-info-header">
          <h3>애칭 백과사전 📖</h3>
        </div>

        {/* 사전 본문 */}
        <div className="dictionary-container">
          <button className="arrow left">〈</button>
          <div className="dictionary-book">
            {/* 왼쪽 페이지 */}
            <div className="dictionary-page">
              <h2>뽕떡이 <span className="edit-btn">편집</span></h2>
              <p className="description">
                 찹쌀떡이나 빵처럼 보일 때 쓰는 말
              </p>
              <ol>
                <li>얼굴이</li>
                <li>피부가</li>
                <li>약간의</li>
              </ol>
              <p className="example">예시: "우리 뽕떡이 오늘 왜 이렇게 귀여워?"</p>
              <p>사용횟수: 10회</p>
              <p>
                동음의어: <span className="link">반죽이</span>, <span className="link">여보</span>, <span className="link">허니</span>
              </p>
              <p># 여자친구</p>
              <div className="time-info">
                <p>생성 시각: </p>
                <p>수정 시각: </p>
              </div>
            </div>

            {/* 오른쪽 페이지 */}
            <div className="dictionary-page">
              <h2>뽕떡이 <span className="edit-btn">편집</span></h2>
              <p className="description">
                얼굴이 동글동글하고 통통해서 
              </p>
              <ol>
                <li>얼굴이</li>
                <li>피부가</li>
                <li>약간의</li>
              </ol>
              <p className="example">예시: </p>
              <p>사용횟수: 회</p>
              <p>
                동음의어: <span className="link">반죽이</span>, <span className="link">여보</span>, <span className="link">허니</span>
              </p>
              <p># 여자친구</p>
              <div className="time-info">
                <p>생성 시각: 2025-05-16 04:49:02</p>
                <p>수정 시각: 2025-05-16 04:49:02</p>
              </div>
            </div>
          </div>
          <button className="arrow right">〉</button>
        </div>
      </div>
    </div>
  );
};

export default DictionaryPage;
