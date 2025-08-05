import { useNavigate } from "react-router-dom";
import WhiteLoginBtn from "../assets/icons/LoginBtnWhite.svg";
import StartBtn from "../assets/icons/Startbtn.svg";
import TItleMockUp from "../assets/images/TItleMockUp.png";
import CurvedLoop from "../components/animations/CurvedLoop/CurvedLoop";
import Logo from "../components/Logo";
import FixedButtons from "../components/onboarding/FixedButtons";
import OnBoardingFooter from "../components/onboarding/OnBoardingFooter";
import OnBoardingGallery from "../components/onboarding/OnBoardingGallery";
import OnBoardingInfo from "../components/onboarding/OnBoardingInfo";
import "../styles/OnBoardingPage.css";

export default function OnBoardingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Logo variant="fixed" />
      <div className="onboaring-layout">
        <div className="onboarding-title">
          <h2>우리 사이, 아이(AI)가 이어줘요</h2>
          <p>
            우리의 사소한 하루들이,
            <br />
            아이 덕분에 특별해지는 경험을 제공해드립니다.
          </p>
          <div className="auth-btn">
            <img
              src={StartBtn}
              alt="시작하기"
              onClick={() => navigate("/auth")}
            />
            <img
              src={WhiteLoginBtn}
              alt="로그인"
              onClick={() => navigate("/auth")}
            />
          </div>
          <img src={TItleMockUp} alt="타이틀" className="onboarding-image" />
        </div>
        <CurvedLoop
          marqueeText="   AI   ✦   CONTACT   ✦"
          speed={1.5}
          curveAmount={0}
          direction="left"
          interactive={false}
          className="text-decoration"
        />
        <OnBoardingInfo />
        <FixedButtons />
        <OnBoardingGallery />
        <OnBoardingFooter />
      </div>
    </>
  );
}
