import React from 'react';
import Sidebar from '../components/Sidebar';
import backgroundImage from '../assets/images/whiteboard.svg';
import homeIcon from '../assets/icons/homebtn.png';
import QuestionBoard from '../assets/images/QuestionBoard.svg'

import '../styles/MainPages.css';
import '../styles/CartoonPage.css';
import { useNavigate } from 'react-router-dom';
import CartoonPageBtn from '../assets/icons/cartoonpagebtn.svg';



export default function ChatRoom() {
    const navigate = useNavigate();
    return (
        <div className='main-layout'>
            <Sidebar />

            <div className='cartoon-content'
            // style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <img src={backgroundImage} alt="베경" className='background-img' />
                <img src={homeIcon}
                    alt="홈"
                    className='home-icon-img'
                    onClick={() => navigate('/')}
                />
                {/* <div className='board-box'>
                    <textarea placeholder='글씨 입력할 거야' />
                </div> */}

                <div className='board-box'>
                    <img src={QuestionBoard} alt="베경" className='background-img' />
                    <div className="input-overlay">
                        <input type="text" 
                            className="answer-input input-1" 
                            placeholder='예: 강남역 앞 / 놀이공원 / 카페'/>
                        <input type="text"
                            className="answer-input input-2" 
                            placeholder='예: 영화보기 / 떡볶이 / 손잡기'/>
                        <input type="text" 
                            className="answer-input input-3" 
                            placeholder='예: 사진 찍다 넘어짐 / 비가 와서 산책 못 함'/>
                        <input type="text" 
                            className="answer-input input-4" 
                            placeholder='예: 설렘 / 달콤'/>
                    </div>

                    <div className='button-container'>
                        <button className='page-btn'> 이전  작품 </button>
                        <button className='page-btn'> 제작하기 </button>
                    </div>
                </div>

                <div className="cartoon-header">
                    <div className='hashtags'>
                        <span>#재미있는</span>
                        <span>#네컷만화</span>
                    </div>

                    <div className='title-box'>
                        <h1>포비의 네컷만화 제작소</h1>

                    </div>
                </div>

            </div>
        </div>
    );
};