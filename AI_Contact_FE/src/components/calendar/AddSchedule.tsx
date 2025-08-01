import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';

import '../../styles/AddSchedule.css';

import 'swiper/css';

interface AddScheduleProps{
    dateInfo : Date;
    onCancel : () => void;
}

export default function AddSchedule({onCancel, dateInfo} : AddScheduleProps){

  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];


    const formatNumber = (num: number) => String(num).padStart(2, '0');
    const hours = Array.from({ length: 24 }, (_, i) => formatNumber((i + 9) % 24));
    const minutes = Array.from({ length: 60 }, (_, i) => formatNumber(i));

        return(
        <div className="calendar-modal add-schedule">
            <div className="modal-header">
                <div className="date">
                    <div className="monthday">{dateInfo.getMonth()+1}월 {dateInfo.getDate()}일</div>
                    <div className="day">{days[dateInfo.getDay()]}</div>
                </div>
            </div>
            <form className="modal-body">
                <input className="schedule-title" placeholder='제목'></input>
                <div className="modal-content">
                    <div className="section timer">
                        <p className="title">시간</p>
                        <div className = "timer-layout">
                            <Swiper
                            centeredSlides={true}
                            slidesPerView={3}
                            mousewheel={true}
                            loop={true}
                            modules={[Mousewheel]}
                            direction={'vertical'}
                        className="mySwiper">
                            {hours.map((hour) => (
                                <SwiperSlide key={`hour-${hour}`}>
                                    {hour}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Swiper
                            centeredSlides={true}
                            slidesPerView={3}
                            loop={true}
                            mousewheel={true}
                            modules={[Mousewheel]}
                            direction={'vertical'}
                        className="mySwiper">
                            {minutes.map((minute) => (
                                <SwiperSlide key={`minute-${minute}`}>
                                    {minute}
                                </SwiperSlide>
                                ))}
                        </Swiper>
                        </div>
                        
                    <div />
                    </div>
                    <div className="section memo">
                        <p className="title">메모</p>
                        <textarea className="memo" placeholder='메모를 입력하세요.'></textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onCancel}>취소</button>
                    <button className="submit-btn">전송</button>
                </div>
            </form>
        </div>
  );
}
