import Schedule from "./Schedule";
import plusBtn from "../../assets/icons/Plus.svg";
import '../../styles/CalendarDetail.css';

interface CalendarDetailProps{
    dateInfo : Date;
    onAdd : () => void;
}

export default function CalendarDetail({dateInfo, onAdd}: CalendarDetailProps){

    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const calendarEvents = [
        {title:"포비 산책", time : '13:00', memo:"산책산책산책", index:1},
        {title:"포비 밥주기", time: "14:00", memo:"밥밥밥", index:2},
        {title:"포비 놀기", time: "17:30", memo:"놀기놀기놀기", index:2},
        {title:"포비 포비 포비", time: "19:00", memo:"포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비포비", index:2},
        {title:"포비 산책", time: "21:50", memo:"산책산책산책", index:2},
        {title:"포비 산책", time : '13:00', memo:"산책산책산책", index:1},
        {title:"포비 밥주기", time: "14:00", memo:"밥밥밥", index:2},
        {title:"포비 놀기", time: "17:30", memo:"놀기놀기놀기", index:2},
        {title:"포비 포비 포비", time: "19:00", memo:"포비포비포비포비포비포비포비포비포비", index:2},
        {title:"포비 산책", time: "21:50", memo:"산책산책산책", index:2},

    ]

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
                    <Schedule time={obj.time} title={obj.title} content={obj.memo}/>
                    )
                })}
            </div>
        </div>
    );
}