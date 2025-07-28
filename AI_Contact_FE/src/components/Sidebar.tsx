import React from 'react';
import '../styles/Sidebar.css'; 
import Logo from './Logo.tsx';

// 컴포넌트 만들기
export default function Sidebar() {
  return (
    // 전체 사이드바를 감싸는 컨테이너
    <aside className="sidebar">
       {/* 상단 영역: 로고 + 제목 + 메뉴 리스트 */}
      <div>
       {/* 제목 줄: 로고 이미지 + 텍스트 "아이:건택" */}
      <Logo />

      {/* 내비게이션 메뉴 */}
      <nav>
        <ul>
          <li className="active">아이</li>
          <li>갤러리</li>
          <li>캘린더</li>
          <li>애칭 백과사전</li>
          <li>마이페이지</li>
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
