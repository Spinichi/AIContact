import '../../styles/FixedButtons.css';
import TopBtn from "../../assets/icons/TopBtn.svg";
import LoginBtnGradient from "../../assets/icons/LoginBtnGradient.svg";
import SignUpBtn from "../../assets/icons/SignUpBtn.svg";
import { useState, useEffect } from "react";

export default function FixedButtons(){
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > window.innerHeight) setIsVisible(true);
        else setIsVisible(false);
    };

     // 맨 위로 스크롤하는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // 부드럽게 스크롤
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

    return (
    <div className="fixed-button">
        {isVisible && (
                <>
                    <img src={TopBtn} className="top-button" onClick={scrollToTop} />
                    <div className="fixed-navbar">
                        <img src={LoginBtnGradient} className="login" />
                        <img src={SignUpBtn} className="signup" />
                    </div>
                </>
            )
        }
    </div>
    )
}