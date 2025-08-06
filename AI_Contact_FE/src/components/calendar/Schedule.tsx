import React, {useState} from 'react';

interface ScheduleProps{
    time : string
    title : string
    content : string
}

export default function Schedule({time, title, content} : ScheduleProps){

    const [isCollapse, setIsCollapse] = useState(false);

    const date = new Date(time);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return(
        <div className="schedule-container"  onClick={() => setIsCollapse(!isCollapse)}>
        <div className="schedule-header">
            <p className="schedule-time">{formattedTime}</p>
            <p className="schedule-title">{title}</p>
        </div>
        {isCollapse && 
            <div className='schedule-content'>{content}</div>}
        </div>
    )
}