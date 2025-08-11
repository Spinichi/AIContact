import { useNavigate } from "react-router-dom";
import TalkIcon from "../assets/icons/TalkIcon.svg?react";
import "../styles/BabyAvatar.css";

interface BabyAvatarProps {
  name: string; // 아이 이름
  imageUrl: string; // 아이 프로필 이미지 URL
}

export default function BabyAvatar({ name, imageUrl }: BabyAvatarProps) {
  const navigate = useNavigate();

  return (
    <div className="baby-container">
      <div className="baby-avatar-wrapper">
        <h1 className="baby-name">{name}</h1>

        <div className="image-wrapper">
          <img src={imageUrl} alt={name} className="baby-image" />
          <div className="talk-button" onClick={() => navigate("/talk")}>
            <TalkIcon />
            <div>이야기하기</div>
          </div>
        </div>
      </div>
    </div>
  );
}
