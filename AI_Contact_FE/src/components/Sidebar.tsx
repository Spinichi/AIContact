import React from 'react';
import '../styles/Sidebar.css'; 
import Logo from './Logo.tsx';
import { Link } from 'react-router-dom';

// 컴포넌트 만들기
export default function Sidebar() {
  return (
    // 전체 사이드바를 감싸는 컨테이너
    <aside className="sidebar">
       {/* 상단 영역: 로고 + 제목 + 메뉴 리스트 */}
      <div>
       {/* 제목 줄: 로고 이미지 + 텍스트 "아이:건택" */}
      <Logo />

        <nav>
          <ul>
            {/* 현재 경로가 "/"일 때 active */}
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">아이</Link>
            </li>

            {/* 현재 경로가 "/gallery"일 때 active */}
            <li className={location.pathname === '/gallery' ? 'active' : ''}>
              <Link to="/gallery">갤러리</Link>
            </li>

            {/* 현재 경로가 "/calendar"일 때 active */}
            <li className={location.pathname === '/calendar' ? 'active' : ''}>
              <Link to="/calendar">캘린더</Link>
            </li>

            <li className={location.pathname === '/dictionary' ? 'active' : ''}>
              <Link to="/dictionary">애칭 백과사전</Link>
            </li>
            <li className={location.pathname === '/mypage' ? 'active' : ''}>
              <Link to="/mypage">마이페이지</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 하단 영역: 닫기 버튼과 로그아웃 버튼 */}
      <div className="sidebar-bottom">
        <button>❌</button>
        <button>로그아웃</button>
      </div>
    </aside>
  );
}
