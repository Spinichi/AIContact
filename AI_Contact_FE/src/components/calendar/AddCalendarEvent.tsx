import '../../styles/AddCalendarEvent.css';

interface AddCalendarEventProps{
    dateInfo : Date;
    onCancel : () => void;
}

export default function AddCalendarEvent({onCancel, dateInfo} : AddCalendarEventProps){

    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

        return(
        <div className="calendar-modal">
            <div className="modal-header">
                <div className="date">
                    <div className="monthday">{dateInfo.getMonth()+1}월 {dateInfo.getDate()}일</div>
                    <div className="day">{days[dateInfo.getDay()]}</div>
                </div>
            </div>
            <div className="modal-body">
                
            </div>
            <div className="modal-footer">
                <button className="cancel-btn" onClick={onCancel}>취소하기</button>
                <button className="submit-btn">전송하기</button>
            </div>
        </div>
    );
}