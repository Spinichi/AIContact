export default function CalendarDetail({dateInfo}: Date){
    return(
        <div>{dateInfo.getDay()}</div>
    );
}