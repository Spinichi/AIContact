import downloadBtn from '../../assets/icons/downloadbtn.svg';

interface CartoonProps{
    date : Date
    image_url : string
    hashtag : Array<String>
}

export default function Cartoon(toonInfo : CartoonProps){
    return(
    <div className="cartoon-container">
        <div className = "cartoon-date">
            {`${toonInfo.date.getFullYear()}년 `}
            {`${toonInfo.date.getMonth()+1}월 `}
            {`${toonInfo.date.getDate()}일`}
        </div>
        <div className='cartoon-content'> 
            <img src={toonInfo.image_url} className="cartoon-img"/>
            <a href={toonInfo.image_url} download="sample" className="cartoon-download">
                <img src={downloadBtn} />
            </a>
        </div>
        <div className='cartoon-hashtag'>
            {toonInfo.hashtag.map((tag) => {
                return <p>#{tag}</p>
            })}
        </div>
    </div>);
}   