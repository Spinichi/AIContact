import React from 'react';
import '../styles/MainEventCalendar.css';

export default function EventCalendar() {
  const events = [
    { icon: '🐶', title: '포비 산책', day: 'Today' },
    { icon: '🛍️', title: '포비 굿즈 구매', day: 'D-5' },
    { icon: '🍽️', title: '레스토랑 예약하기', day: 'D-6' },
    { icon: '🎂', title: '엄마 생신', day: 'D-10' },
    { icon: '💞', title: '100일 💕', day: 'D-12' },
  ];

  return (
    <div className="event-calendar">
      <div className="calendar-header">2025.08.18</div>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <div className="icon">{event.icon}</div>
            <span className="title">{event.title}</span>
            <span className="day">{event.day}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
