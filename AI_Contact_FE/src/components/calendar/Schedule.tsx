import React, {useState} from 'react';

interface ScheduleProps{
    time : String
    title : String
    content : String
}

export default function Schedule({time, title, content} : ScheduleProps){

    const [isCollapse, setIsCollapse] = useState(false);

    return(
        <div className="schedule-container"  onClick={() => setIsCollapse(!isCollapse)}>
        <div className="schedule-header">
            <p className="schedule-time">{time}</p>
            <p className="schedule-title">{title}</p>
        </div>
        {isCollapse && 
            <div className='schedule-content'>{content}</div>}
        </div>
    )
}