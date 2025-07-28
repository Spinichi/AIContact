// import React from 'react';

// const GalleryPage: React.FC = () => {
//   return (
//     <div>
//       <h1>갤러리 페이지</h1>
//     </div>
//   );
// };

// export default GalleryPage;

import '../styles/MainPages.css';
import React from 'react';
import Sidebar from '../components/Sidebar';

import '../styles/GalleryPage.css';

export default function GalleryPage() {
  return (
    <div className='main-layout'>
      {/* 왼쪽 사이드바 그대로 */}
      <Sidebar />

      {/* 오른쪽 메인 컨텐츠 영역 */}
      <div className='main-content'>
        {/* 상단 헤더 */}
        <div className="user-info-header">
          <h3>갤러리</h3>
        </div>

        {/* 갤러리 페이지 본문 */}
        <div className="gallery-container">
          {/* 상단 필터 메뉴 */}
          <div className="gallery-header">
            <div className="gallery-tabs">
              <span className="active">전체</span>
              <span>즐겨찾기</span>
            </div>
            <div className="gallery-sort">
              <span className="active">최신순</span>
              <span>오래된순</span>
              <span className="calendar-icon">📅</span>
              <button className="upload-btn">⬆ 업로드</button>
            </div>
          </div>

          {/* 앨범 */}
          <div className="album-wrapper">
            <button className="arrow left">〈</button>
            <div className="album">
              {/* 왼쪽 페이지 */}
              <div className="album-page">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="photo-box">
                    <img
                      src={`/images/sample${i + 1}.jpg`}
                      alt={`sample-${i + 1}`}
                    />
                  </div>
                ))}
              </div>
              {/* 오른쪽 페이지 */}
              <div className="album-page">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="photo-box">
                    <img
                      src={`/images/sample${i + 13}.jpg`}
                      alt={`sample-${i + 13}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button className="arrow right">〉</button>
          </div>

          {/* 페이지 번호 */}
          <div className="page-number">2</div>
        </div>
      </div>
    </div>
  );
}
