import { useState } from 'react';
import { createPortal } from 'react-dom';

import "../styles/MainPages.css";
import "../styles/CalendarPage.css";

import CalendarDetail from '../components/calendar/CalendarDetail';
import AddCalendarEvent from '../components/calendar/AddCalendarEvent';
import Modal from '../components/modal/Modal';
import Sidebar from "../components/Sidebar";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 'timeGridWeek' 뷰를 위해 필요합니다.
import interactionPlugin, {type DateClickArg} from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { type DayCellContentArg } from '@fullcalendar/core/index.js';



export default function CalendarPage() {

  type ModalType = 'detail' | 'add' | 'off';

  const [modalStatus, setModalStatus] = useState<ModalType>('off');
  const [clickedDateInfo, setClickedDateInfo] = useState<DateClickArg | null>(null);

  function openCalendarDetail(dateInfo : DateClickArg) {
    console.log(dateInfo);
    console.log(typeof (dateInfo));
    setClickedDateInfo(dateInfo);
    setModalStatus('detail');
  }

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

  const handleDayCellContent = (e : DayCellContentArg) => {
    const dayNumber = e.dayNumberText.replace("일", "");
    return dayNumber;
  };

  function setModalContent(modalStatus : ModalType){
      switch (modalStatus){
        case 'off':
          return null;
        case 'detail':
          return <Modal onClose={()=>setModalStatus('off')} hasNext={true} hasPrev={true}>
          {clickedDateInfo && <CalendarDetail dateInfo={clickedDateInfo.date} onAdd={()=>setModalStatus('add')}/>}</Modal>;
        case 'add':
          return <Modal onClose={()=>setModalStatus('off')} hasNext={false} hasPrev={false}>
            {clickedDateInfo && <AddCalendarEvent dateInfo={clickedDateInfo.date} onCancel={() => setModalStatus('detail')} />}</Modal>;
      }
  }

  return (
    <div className="main-layout">
      {modalStatus!='off' && createPortal(setModalContent(modalStatus),
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
            dateClick={openCalendarDetail}
          />
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};