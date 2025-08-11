import { useNavigate } from "react-router-dom";
import TalkIcon from "../assets/icons/TalkIcon.svg?react";
import babyImage from "../assets/images/AI.png";
import "../styles/BabyAvatar.css";

// BabyAvatar 컴포넌트 정의
export default function BabyAvatar() {
  const navigate = useNavigate();
  return (
    <div className="baby-container">
      <div className="baby-avatar-wrapper">
        <h1 className="baby-name"> 포비 </h1>
        <div className="image-wrapper">
          <img src={babyImage} alt="포비" className="baby-image" />
          <div className="talk-button" onClick={() => navigate("/talk")}>
            <TalkIcon />
            <div>이야기하기</div>
          </div>
        </div>
      </div>
    </div>
  );
}
