import React from 'react';
import '../styles/RightIcons.css';
import chatIcon from '../assets/icons/chat.png';
import WebRTCgIcon from '../assets/icons/WebRTC Button.png';
import Growth from '../assets/icons/Growth Button.png';
import cartoonIcon from '../assets/icons/cartoon.png';

// 이 컴포넌트가 받는 props의 타입 정의
interface RightIconsProps {
  onChatClick: () => void; //onChatClick이라는 props는 "아무것도 받지 않고 아무것도 반환하지 않는 함수"여야 함
}

// RightIconsProps 타입의 props를 받는다는 뜻
const RightIcons: React.FC<RightIconsProps> = ({ onChatClick }) => {
  return (
    // 오른쪽에 위치할 아이콘 버튼들을 담는 div 
    <div className="right-icons">
      {/* 첫 번째 버튼에 클릭 핸들러 연결 */}
      {/* 부모 컴포넌트에서 넘겨준 onChatClick 함수를 버튼 클릭 시 실행 */}
      <button onClick={onChatClick}>
        <img src={chatIcon} alt="채팅" />
      </button>
      <button><img src={WebRTCgIcon} alt="영상통화" /></button>
      <button><img src={Growth} alt="일기쓰기" /></button>
      <button><img src={cartoonIcon} alt="기록보기" /></button>
    </div>
  );
};

export default RightIcons;
