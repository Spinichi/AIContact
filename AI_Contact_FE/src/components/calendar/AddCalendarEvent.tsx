// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Mousewheel } from 'swiper/modules';

import "../../styles/AddCalendarEvent.css";

// import 'swiper/css';

interface AddCalendarEventProps {
  dateInfo: Date;
  onCancel: () => void;
}

export default function AddCalendarEvent({
  onCancel,
  dateInfo,
}: AddCalendarEventProps) {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const formatNumber = (num) => String(num).padStart(2, "0");
  const hours = Array.from({ length: 24 }, (_, i) => formatNumber(i));
  const minutes = Array.from({ length: 60 }, (_, i) => formatNumber(i));

  const profileFormat = [1, 2, 3];

  return (
    <div className="calendar-modal add-calendar-event">
      <div className="modal-header">
        <div className="date">
          <div className="monthday">
            {dateInfo.getMonth() + 1}월 {dateInfo.getDate()}일
          </div>
          <div className="day">{days[dateInfo.getDay()]}</div>
        </div>
      </div>
      <form className="modal-body">
        <input className="event-title" placeholder="제목"></input>
        <div className="modal-content">
          <div className="timer">
            <p className="timer-title">시간</p>
            <div className="timer-layout">
              <Swiper
                centeredSlides={true}
                slidesPerView={3}
                loop={true}
                modules={[Mousewheel]}
                direction={"vertical"}
                className="mySwiper"
              >
                {hours.map((hour) => (
                  <SwiperSlide key={`hour-${hour}`}>{hour}</SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                centeredSlides={true}
                slidesPerView={3}
                loop={true}
                modules={[Mousewheel]}
                direction={"vertical"}
                className="mySwiper"
              >
                {minutes.map((minute) => (
                  <SwiperSlide key={`minute-${minute}`}>{minute}</SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div />
          </div>
          <div className="profile-selection">
            {profileFormat.map((num) => (
              <div className="profile-list">
                {(num & 1) != 0 && <div className="event-profile first" />}
                {((num >> 1) & 1) != 0 && (
                  <div className="event-profile second" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onCancel}>
            취소
          </button>
          <button className="submit-btn">전송</button>
        </div>
      </form>
    </div>
  );
}
