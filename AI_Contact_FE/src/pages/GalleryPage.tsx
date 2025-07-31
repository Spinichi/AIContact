import React, { useState } from 'react';
import '../styles/GalleryPage.css';
import photobook from '../assets/images/photobook.png'
import '../styles/MainPages.css'
import Sidebar from '../components/Sidebar';

export default function PhotoBook() {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  return (
<div className='main-layout'>
  <Sidebar />

  <div className='album-content'>
    {/* 필터 / 정렬 / 업로드 영역 */}
    <div className='gallery-top-bar'>
      <div className='gallery-tabs'>
        <button className='active'>전체</button>
        <button>즐겨찾기</button>
      </div>
      <div className='gallery-actions'>
        <button className='sort-btn active'>최신순</button>
        <button className='sort-btn'>오래된순</button>
        <button className='calendar-btn'>📅</button>
        <label className='upload-label'>
          📤 업로드
          <input type='file' multiple accept='image/*' onChange={handleUpload} />
        </label>
      </div>
    </div>

    {/* 앨범 */}
    <div className='photobook-wrapper'>
      <div className='photobook'>
        {/* 왼쪽 사진 */}
        <div className='photo-grid left'>
          {Array.from({ length: 12 }).map((_, i) => (
            <div className='photo-box' key={i}>
              {photos[i] && <img src={photos[i]} alt={`photo-${i}`} />}
            </div>
          ))}
        </div>

        {/* 오른쪽 사진 */}
        <div className='photo-grid right'>
          {Array.from({ length: 12 }).map((_, i) => (
            <div className='photo-box' key={i + 12}>
              {photos[i + 12] && <img src={photos[i + 12]} alt={`photo-${i + 12}`} />}
            </div>
          ))}
        </div>

        {/* 배경 */}
        <img src={photobook} alt='photobook background' className='photobook-bg' />
      </div>
    </div>
  </div>
</div>

  );
}
