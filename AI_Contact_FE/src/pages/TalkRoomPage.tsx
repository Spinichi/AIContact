import React from 'react';
import Sidebar from '../components/Sidebar';
import backgroundImage from '../assets/images/talkroom_background.png';
import homeIcon from '../assets/icons/homebtn.png';

import '../styles/MainPages.css';
import '../styles/TalkRoom.css';
import { useNavigate } from 'react-router-dom';
import babyImage from '../assets/images/AIbaby.png';


export default function ChatRoom() {
      const navigate = useNavigate();
  return (
     <div className='main-layout'>
      <Sidebar />

        <div className='talkroom-content' 
        style={{ backgroundImage: `url(${backgroundImage})`}}>
            
        <img src={homeIcon} 
            alt="홈" 
            className='home-icon-img'
            onClick={() => navigate('/')}
        />
            
            <div className="talkroom-header">
                <div className='hashtags'>
                    <span>#걱정금지</span>
                    <span>#고민해결</span>
                </div>

                <div className='title-box'>
                    <h1>포비의 고민상담소 🔮</h1>

                </div>
            </div>
        <img src={babyImage} alt="AI 아이" className="AIbaby-image" />
        </div>
    </div>
  );
};