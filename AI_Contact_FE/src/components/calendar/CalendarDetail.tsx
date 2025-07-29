import plusBtn from "../../assets/icons/Plus.svg";
import '../../styles/CalendarDetail.css';

interface CalendarDetailProps{
    dateInfo : Date;
}

export default function CalendarDetail({dateInfo}: CalendarDetailProps){

    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const calendarEvents = [
        {title:"포비 산책", time : '13:00', play_index:1, index:1},
        {title:"포비 밥주기", time: "14:00", play_index:2, index:2},
        {title:"포비 놀기", time: "17:30", play_index:1, index:2},
        {title:"포비 포비 포비", time: "19:00", play_index:2, index:2},
        {title:"포비 산책", time: "21:50", play_index:3, index:2},
    ]

    return(
        <div className="calendar-modal">
            <div className="modal-header">
                <div className="date">
                    <div className="monthday">{dateInfo.getMonth()+1}월 {dateInfo.getDate()}일</div>
                    <div className="day">{days[dateInfo.getDay()]}</div>
                </div>
                <img src={plusBtn} className="add-btn" />
            </div>
            <div className="modal-body">
                {
                    calendarEvents.map((obj) => {
                    return (
                    <div className="event-list">
                        <p className="event-time">{obj.time}</p>
                        <div className="event-profile-list">
                            {((obj.play_index&1)!=0) && <div className="event-profile first" />}
                            {(((obj.play_index>>1)&1)!=0) && <div className="event-profile second" />}
                        </div>
                        
                        <p className="event-title">{obj.title}</p>
                    </div>
                    )
                })}
            </div>
        </div>
    );
}