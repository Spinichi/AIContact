import React, { useState } from 'react';
import '../styles/GalleryPage.css';
import photobook from '../assets/images/photobook.png';
import '../styles/MainPages.css';
import Sidebar from '../components/Sidebar';
import Modal from '../components/modal/Modal'; // Modal 가져오기


export default function PhotoBook() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("전체");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // 현재 클릭한 사진 인덱스

  const years = ["전체", "2025년", "2024년", "2023년", "2022년"];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  // 사진 클릭 → 인덱스 저장
  const handlePhotoClick = (index: number) => {
    setCurrentIndex(index);
  };

  // 모달 닫기
  const handleClose = () => {
    setCurrentIndex(null);
  };

const handlePrev = () => {
  setCurrentIndex((prevIndex) => {
    if (prevIndex === null) return null; 
    return prevIndex === 0 ? photos.length - 1 : prevIndex - 1;
  });
};

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return prevIndex === photos.length - 1 ? 0 : prevIndex + 1;
    });
  };

  // const handlePrev = () => {
  //   if (currentIndex !== null) {
  //     setCurrentIndex((prevIndex) =>
  //       prevIndex === 0 ? photos.length - 1 : prevIndex - 1);
  //   }
  // };

  // const handleNext = () => {
  //   if (currentIndex !== null) {
  //     setCurrentIndex((prevIndex) =>
  //       prevIndex === photos.length - 1 ? 0 : prevIndex + 1
  //     );
  //   }
  // };

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

            {/* 달력 버튼 */}
            <button
              className='calendar-btn'
              onClick={() => setIsDropDownOpen(prev => !prev)}
            >
              📅
              {isDropDownOpen && (
                <div className='calendar-dropdown'>
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`dropdown-item ${selectedYear === year ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsDropDownOpen(false);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </button>

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
                  {photos[i] && (
                    <img
                      src={photos[i]}
                      alt={`photo-${i}`}
                      onClick={() => handlePhotoClick(i)} // 클릭 시 모달 열기
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 오른쪽 사진 */}
            <div className='photo-grid right'>
              {Array.from({ length: 12 }).map((_, i) => (
                <div className='photo-box' key={i + 12}>
                  {photos[i + 12] && (
                    <img
                      src={photos[i + 12]}
                      alt={`photo-${i + 12}`}
                      onClick={() => handlePhotoClick(i + 12)} // 클릭 시 모달 열기
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 배경 */}
            <img src={photobook} alt='photobook background' className='photobook-bg' />
          </div>
        </div>
      </div>

      {/* 모달: currentIndex가 있을 때만 보여주기 */}
      {currentIndex !== null && (
        <Modal
          onClose={handleClose}
          hasPrev={true}
          hasNext={true}
          onPrev={handlePrev}
          onNext={handleNext}
        >
          <img
            src={photos[currentIndex]}
            alt='selected'
            style={{ maxHeight: '80vh', maxWidth: '80vw' }}
            onClick={(e) => {
              // 클릭 위치에 따라 이전 / 다음 이동 
              const clickX = e.nativeEvent.offsetX;
              const imgWidth = e.currentTarget.clientWidth;
              if (clickX < imgWidth / 2) {
                handlePrev();
              } else {
                handleNext();
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}
