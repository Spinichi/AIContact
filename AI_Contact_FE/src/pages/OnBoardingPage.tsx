import CurvedLoop from "../components/animations/CurvedLoop/CurvedLoop";
import Logo from "../components/Logo";
import StartBtn from "../assets/icons/Startbtn.svg";
import WhiteLoginBtn from "../assets/icons/LoginBtnWhite.svg";
import TItleMockUp from "../assets/images/TItleMockUp.png";
import '../styles/OnBoardingPage.css';

export default function OnBoardingPage(){
    return <>
        <Logo variant="fixed" />
        <div className="onboaring-layout">
            <div className="onboarding-title">
                <h2>우리 사이, 아이(AI)가 이어줘요</h2>
                <p>우리의 사소한 하루들이,<br />아이 덕분에 특별해지는 경험을 제공해드립니다.</p>
                <div className="auth-btn">
                    <img src={StartBtn} alt="시작하기"/>
                    <img src={WhiteLoginBtn} alt="로그인"/>
                </div>
            </div>
            <img src={TItleMockUp} alt="타이틀" className="onboarding-image"/>
        </div>
        <CurvedLoop 
            marqueeText="   AI   ✦   CONTACT   ✦"
            speed={2}
            curveAmount={0}
            direction="left"
            interactive={false}
            className="text-decoration"
        />
    </>;
}