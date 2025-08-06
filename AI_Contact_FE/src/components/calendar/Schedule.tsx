import React, {useState} from 'react';
import { dailySchedulesApi } from '../../apis/dailySchedule';

interface ScheduleProps{
    id : number
    time : string
    title : string
    content : string
    onDelete : () => void
}

export default function Schedule({id, time, title, content, onDelete} : ScheduleProps){

    const [isCollapse, setIsCollapse] = useState(false);

    const date = new Date(time);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    const handleDelete = async () => {
        if(window.confirm('삭제 하시겠습니까?')){
            try{
                const response = await dailySchedulesApi.deleteSchedule(id);
                console.log("삭제 완료", response);
                onDelete();
            }
            catch(e){
                console.log("일정 삭제 중 에러 발생", e);
                alert("일정 삭제 중 오류가 발생했습니다");
            }
        }
    }

    return(
        <div className="schedule-container">
        <div className="schedule-header"  onClick={() => setIsCollapse(!isCollapse)}>
            <p className="schedule-time">{formattedTime}</p>
            <p className="schedule-title">{title}</p>
        </div>
        {isCollapse && 
            <div className='schedule-content'>
                <p>{content}</p>
                <button>수정</button>
                <button onClick={handleDelete}>삭제</button>
            </div>}
        </div>
    )
}