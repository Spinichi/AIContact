import '../../styles/CoupleConnection.css';
import heart from '../../assets/images/heart.png';

export default function MyConnectionInfo(){
    return(
        <form className="connection-container">
            <div className="heart">
                <img src={heart}></img>
            </div>
            <p className="code-label">연인의 커플 코드를 입력해 주세요.</p>
            <input type='text' placeholder='코드 입력'/>
            <button>연결하기</button>
        </form>
    );
}