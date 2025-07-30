import React from 'react';
import '../styles/Sidebar.css'; 
import Logo from './Logo.tsx';
import {useNavigate} from 'react-router-dom';

// 컴포넌트 만들기
export default function Sidebar() {
  const navigate = useNavigate();
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
            <li
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => navigate('/')}
            >
              아이
            </li>

            <li
              className={location.pathname === '/gallery' ? 'active' : ''}
              onClick={() => navigate('/gallery')}
            >
              갤러리
            </li>

            <li
              className={location.pathname === '/calendar' ? 'active' : ''}
              onClick={() => navigate('/calendar')}
            >
              캘린더
            </li>

            <li
              className={location.pathname === '/dictionary' ? 'active' : ''}
              onClick={() => navigate('/dictionary')}
            >
              애칭 백과사전
            </li>

            <li
              className={location.pathname === '/mypage' ? 'active' : ''}
              onClick={() => navigate('/mypage')}
            >
              마이페이지
            </li>
          </ul>
        </nav>
      </div>

      {/* 하단 영역: 닫기 버튼과 로그아웃 버튼 */}
      <div className="sidebar-bottom">
        <button>❌</button>
        <button onClick={() => {
          localStorage.removeItem('accessToken');
          navigate('/auth');
        }}>로그아웃</button>
      </div>
    </aside>
  );
}
