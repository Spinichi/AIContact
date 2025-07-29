import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/CalendarPage.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 'timeGridWeek' 뷰를 위해 필요합니다.
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import Modal from '../components/modal/Modal';
import { createPortal } from 'react-dom';


export default function CalendarPage() {

  const [showModal, setShowModal] = useState(false);
  const [clickedDateInfo, setClickedDateInfo] = useState(null);

  const openModal = (dateInfo) => {
    setClickedDateInfo(dateInfo);
    setShowModal(true);
  }
  const closeModal = () => setShowModal(false);

const events = [
    { title: '포비 산책', start: "2025-07-18 13:00"},
    { title: '포비 밥주기', start: "2025-07-18 14:00"},
    { title: '포비 놀기', start: "2025-07-18 17:30"},
    { title: '포비 포비 포비', start: "2025-07-18 19:00"},
    { title: '포비 산책', start: "2025-07-18 21:50"},
    { title: '포비 굿즈 구매', start: "2025-07-23 15:00"},
    { title: '레스토랑 예약하기', start: "2025-07-24 15:00"},
    { title: '엄마 생신', start: "2025-07-28 15:00"},
    { title: '100일 💕', start: "2025-07-29 15:00"},
  ];

  const handleDayCellContent = (e) => {
    const dayNumber = e.dayNumberText.replace("일", "");
    return dayNumber;
  };

  return (
    <div className="main-layout">
      {showModal && createPortal(<Modal onClose={closeModal} hasNext={true} hasPrev={true}>
          <div style={{color : 'white'}}>
            <h3>{clickedDateInfo&&clickedDateInfo.dateStr}</h3>
            <p>이 날짜에 새 일정을 추가하시겠습니까?</p>
          </div>
        </Modal>,
      document.body)}
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        {/* 상단 타이틀 */}
        <div className="user-info-header">
          <h3>캘린더</h3>
        </div>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            editable={true}
            events={events}
            aspectRatio={1.6}
            locale={koLocale}
            headerToolbar={{
              left: 'prev,title,next',
              center: '',
              right: 'today'
            }}
            dayCellContent={handleDayCellContent}
            displayEventTime={false}
            dayMaxEventRows={true}
            dayMaxEvents = {2}
            dateClick={openModal}
          />
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};