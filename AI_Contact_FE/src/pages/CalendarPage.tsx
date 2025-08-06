import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import "../styles/MainPages.css";
import "../styles/CalendarPage.css";

import CalendarDetail from '../components/calendar/CalendarDetail';
import AddSchedule from '../components/calendar/AddSchedule';
import Modal from '../components/modal/Modal';
import Sidebar from "../components/Sidebar";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 'timeGridWeek' 뷰를 위해 필요합니다.
import interactionPlugin, {type DateClickArg} from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { type DayCellContentArg, type EventInput } from '@fullcalendar/core/index.js';
import { dailySchedulesApi } from '../apis/dailySchedule';

export default function CalendarPage() {

  type ModalType = 'detail' | 'add' | 'off';

  const [modalStatus, setModalStatus] = useState<ModalType>('off');
  const [clickedDateInfo, setClickedDateInfo] = useState<DateClickArg | null>(null);
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const response = await dailySchedulesApi.getSchedulesByMonth(today.getFullYear(), today.getMonth()+1);
        const eventsData = response.data;
        const processedData = eventsData.map((element) => ({
          title : element.title,
          start : element.scheduleDate
        }));
        setEvents(processedData);
      } catch (e) { /* empty */ }
    };

    fetchData();

    }, []);

  function openCalendarDetail(dateInfo : DateClickArg) {
    console.log(dateInfo);
    console.log(typeof (dateInfo));
    setClickedDateInfo(dateInfo);
    setModalStatus('detail');
  }

  const handleDayCellContent = (e : DayCellContentArg) => {
    const dayNumber = e.dayNumberText.replace("일", "");
    return dayNumber;
  };

  const handleNextDay = () => {
    if (!clickedDateInfo) return;
    const currentDate = new Date(clickedDateInfo.date);
    currentDate.setDate(currentDate.getDate() + 1);
    setClickedDateInfo(prev => ({ ...(prev || {}), date: currentDate }));
  };

  function handlePrevDay() {
    if (!clickedDateInfo) return;
    const currentDate = new Date(clickedDateInfo.date);
    currentDate.setDate(currentDate.getDate() - 1);
    setClickedDateInfo(prev => ({ ...(prev || {}), date: currentDate }));
  }

  function handleDailyScheduleSumbit(){
    alert("일정이 등록되었습니다.");
    setModalStatus('off');
  }

  function setModalContent(modalStatus : ModalType){
      switch (modalStatus){
        case 'off':
          return null;
        case 'detail':
          return <Modal onClose={()=>setModalStatus('off')} hasNext={true} hasPrev={true} onPrev={handlePrevDay} onNext={handleNextDay}>
            {
              clickedDateInfo && 
                <CalendarDetail 
                  dateInfo={clickedDateInfo.date} 
                  onAdd={()=>setModalStatus('add')}
                />}
              </Modal>;
        case 'add':
          return <Modal onClose={()=>setModalStatus('off')} hasNext={false} hasPrev={false}>
              {
                clickedDateInfo && 
                  <AddSchedule 
                    dateInfo={clickedDateInfo.date} 
                    onCancel={() => setModalStatus('detail')} 
                    onDailyScheduleSubmit={handleDailyScheduleSumbit} 
                  />
              }
            </Modal>;
      }
  }

  return (
    <div className="main-layout">
      {modalStatus!='off' && createPortal(setModalContent(modalStatus), document.body)}
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
            editable={false}
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