import Schedule from "./Schedule";
import plusBtn from "../../assets/icons/Plus.svg";
import '../../styles/CalendarDetail.css';
import { useEffect, useState } from "react";
import { dailySchedulesApi } from "../../apis/dailySchedule/api";
import type { DailyScheduleResponse } from "../../apis/dailySchedule/response";

interface CalendarDetailProps{
    dateInfo : Date;
    onAdd : () => void;
}

export default function CalendarDetail({dateInfo, onAdd}: CalendarDetailProps){

        const [calendarEvents, setCalendarEvents] = useState<DailyScheduleResponse[]>([]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const date = String(dateInfo.toISOString());
            const response = await dailySchedulesApi.getSchedulesByDate(date);
            const eventsData = response.data;
            setCalendarEvents(eventsData);
          } catch (e) { /* empty */ }
        };
    
        fetchData();
    
        }, [dateInfo]);

    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    return(
        <div className="calendar-modal">
            <div className="modal-header">
                <div className="date">
                    <div className="monthday">{dateInfo.getMonth()+1}월 {dateInfo.getDate()}일</div>
                    <div className="day">{days[dateInfo.getDay()]}</div>
                </div>
                <img src={plusBtn} className="add-btn" onClick={onAdd}/>
            </div>
            <div className="modal-body">
                {
                    calendarEvents.map((obj) => {
                    return (
                    <Schedule time={obj.scheduleDate} title={obj.title} content={obj.memo}/>
                    )
                })}
            </div>
        </div>
    );
}