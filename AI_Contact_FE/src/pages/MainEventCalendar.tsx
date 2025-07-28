import React from 'react';
import '../styles/EventCalendar.css';

export default function EventCalendar() {
  return (
    <div className="event-calendar">
      <h4>2025.08.18</h4>
      <ul>
        <li>🍼 준비 산책 <span>Today</span></li>
        <li>🎁 준비 굿즈 구매 <span>D-5</span></li>
        <li>🍽 레스토랑 예약 <span>D-6</span></li>
      </ul>
    </div>
  );
}
