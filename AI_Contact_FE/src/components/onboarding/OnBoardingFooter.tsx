import Symbol from "../../assets/images/symbol.png";
import StartBtn from "../../assets/icons/StartBtn.svg";
import { useNavigate } from "react-router-dom";

export default function OnBoardingFooter() {
  const navigate = useNavigate();
  return (
    <div className="onboarding-footer">
      <img src={Symbol} className="symbol" />
      <p className="description">지금, 우리만의 AI 아이를 만나보세요</p>
      <img
        src={StartBtn}
        alt="시작하기"
        className="start-btn"
        onClick={() => navigate("/auth")}
      />
    </div>
  );
}
