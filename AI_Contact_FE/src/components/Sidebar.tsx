import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import logo from '../assets/images/symbol.png';

const Sidebar: React.FC = () => {
  const location = useLocation(); // 현재 URL 경로 가져오기

  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-title">
          <img src={logo} alt="로고" className="sidebar-logo" />
          AI Contact
        </h2>

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
            <li className={location.pathname === '/mapage' ? 'active' : ''}>
              <Link to="/mypage">마이페이지</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button>❌</button>
        <button>로그아웃</button>
      </div>
    </aside>
  );
};

export default Sidebar;
