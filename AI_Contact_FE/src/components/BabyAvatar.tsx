import React from 'react';
import '../styles/BabyAvatar.css'; /* 해당 컴포넌트 전용 스타일 가져오기 */
import babyImage from '../assets/images/AI.png';  /* 이미지 가져오기 */

// BabyAvatar 컴포넌트 정의
export default function BabyAvatar() {
  return (

    <div className='baby-avatar-wrapper'>
      <h1 className='baby-name'> 포비 </h1>
      {/* 아기 사진을 감싸는 최상위 컨테이너
        이 div는 CSS에서 중앙 정렬 역할을 담당함 */}
      <div className='baby-container'>  
        {/* 실제로 표시되는 아기 이미지
        className을 통해서 css 스타일 */}
        <img src={babyImage} alt="포비" className="baby-image" />    
        
      </div>

      <div className="baby-stats">
        <div># 아빠와의 친밀도 💗💗💗🤍🤍</div>
        <div># 엄마와의 친밀도 💗💗💗💗🤍</div>
      <div># 나이 <strong>2살</strong> | # 현재 기분 😊 <strong>행복함</strong></div>
</div>
    </div>
  );
}