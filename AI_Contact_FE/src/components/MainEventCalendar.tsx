import type { DailyScheduleResponse } from "../apis/dailySchedule/response";
import "../styles/MainEventCalendar.css";

export default function EventCalendar(props: {data : DailyScheduleResponse[]}) {

  const nowDate = new Date();

  const calcDate = (date : string) => {
    const convertedDate = new Date(date);
    const diff = convertedDate.getTime() - nowDate.getTime();
    const day = 60*60*24*1000;
    if(diff <= day) return "Today";
    return "D-" + Math.floor(diff/day);
  }

  return (
    <div className="event-calendar">
      <div className="calendar-header">{nowDate.toLocaleDateString()}</div>
      <ul>
        {props.data && props.data.map((event) => (
          <li key={`${event.scheduleDate}+${event.id}`} className="event-list">
            <span className="title">{event.title}</span>
            <span className={`dday ${nowDate.toDateString() === new Date(event.scheduleDate).toDateString() ? "active" : ""}`}>{calcDate(event.scheduleDate)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
