import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/CalendarPage.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 'timeGridWeek' 뷰를 위해 필요합니다.
import interactionPlugin from '@fullcalendar/interaction';


export default function CalendarPage() {
const events = [
    { title: 'Meeting', start: new Date() }
  ];

  return (
    <div className="main-layout">
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
        height="auto"
      />
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};