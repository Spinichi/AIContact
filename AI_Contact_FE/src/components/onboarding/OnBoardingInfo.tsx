import Lanyard from "../animations/Lanyard/Lanyard";
import ScrollFloat from "../animations/ScrollFloat/ScrollFloat";

export default function OnBoardingInfo(){
    return <div className="onboarding-info">
            <div className="lanyard">
                <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </div>
            <div className="onboarding-info-text">
                <ScrollFloat
                    animationDuration={1}
                    ease='back.inOut(2)'
                    scrollStart='center bottom+=50%'
                    scrollEnd='bottom bottom-=40%'
                    stagger={0.03}
                    >연인 사이, 싸울 때마다 직접 얘기하기 어려우셨죠?</ScrollFloat>
            </div>
        </div>;
}