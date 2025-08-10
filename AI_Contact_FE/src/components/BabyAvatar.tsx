import { useNavigate } from "react-router-dom";
import talkbaby from "../assets/icons/talk.png";
import babyImage from "../assets/images/AI.png"; /* 이미지 가져오기 */
import "../styles/BabyAvatar.css"; /* 해당 컴포넌트 전용 스타일 가져오기 */

// BabyAvatar 컴포넌트 정의
export default function BabyAvatar() {
  const navigate = useNavigate();
  return (
    <div className="baby-container">
      <div className="baby-avatar-wrapper">
        <h1 className="baby-name"> 포비 </h1>
        <div className="image-wrapper">
          <img src={babyImage} alt="포비" className="baby-image" />
          <img
            src={talkbaby}
            alt="이야기하기"
            className="talk-button"
            onClick={() => navigate("/talk")}
          />
        </div>
      </div>

      <div className="baby-stats">
        <div>2살</div>
        <div>😊 행복함</div>
      </div>
    </div>
  );
}
