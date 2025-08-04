import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import backgroundImage from '../assets/images/whiteboard.svg';
import homeIcon from '../assets/icons/homebtn.png';
import QuestionBoard from '../assets/images/QuestionBoard.svg';
import ComicBook from '../assets/images/comicbook.png';

import image1 from '../assets/comics/image.png';
import image2 from '../assets/comics/image (1).png'

import '../styles/MainPages.css';
import '../styles/CartoonPage.css';
import '../styles/Cartoon.css';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Modal from '../components/modal/Modal';
import Cartoon from '../components/cartoon/Cartoon';



export default function ChatRoom() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const arr = [
        {date: new Date("2025-08-01"), image_url: image1, hashtag:["집","슬픔","내 셀카보고 귀엽다고 안해줘","나한테도 귀엽다고 해줘"]},
        {date: new Date("2025-07-22"), image_url: image2, hashtag:["강남역 앞","영화관","사진찍다가 넘어짐","설렘"]},
        {date: new Date("2025-08-03"), image_url: image1, hashtag:["집","슬픔","내 셀카보고 귀엽다고 안해줘","나한테도 귀엽다고 해줘"]},
        {date: new Date("2025-07-24"), image_url: image2, hashtag:["강남역 앞","영화관","사진찍다가 넘어짐","설렘"]},
        {date: new Date("2025-08-05"), image_url: image1, hashtag:["집","슬픔","내 셀카보고 귀엽다고 안해줘","나한테도 귀엽다고 해줘"]},
        {date: new Date("2025-07-26"), image_url: image2, hashtag:["강남역 앞","영화관","사진찍다가 넘어짐","설렘"]},
        {date: new Date("2025-08-07"), image_url: image1, hashtag:["집","슬픔","내 셀카보고 귀엽다고 안해줘","나한테도 귀엽다고 해줘"]},
        {date: new Date("2025-07-28"), image_url: image2, hashtag:["강남역 앞","영화관","사진찍다가 넘어짐","설렘"]}
    ];

    const cartoonLayout = <>
        <div className="cartoon-detail" style={{backgroundImage:`url(${ComicBook})`}}>
            {arr[index] && <Cartoon {...arr[index]} />}            
            {arr[index+1] && <Cartoon {...arr[index+1]} />}       
        </div>
    </>

    function prevImage(){
        setIndex(index==0?Math.floor((arr.length-1)/2)*2:index-2);
    }

    function nextImage(){
        setIndex(index+2>=arr.length?0:index+2);
    }

    return (
        <div className='main-layout'>
            {isModalOpen && createPortal(<Modal onClose={()=>setIsModalOpen(false)} hasPrev={true} hasNext={true}
                onPrev={prevImage} onNext={nextImage}>
                {cartoonLayout}
            </Modal> ,document.body)}
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
                            placeholder='예: 강남역 앞 / 놀이공원 / 카페' />
                        <input type="text"
                            className="answer-input input-2"
                            placeholder='예: 영화보기 / 떡볶이 / 손잡기' />
                        <input type="text"
                            className="answer-input input-3"
                            placeholder='예: 사진 찍다 넘어짐 / 비가 와서 산책 못 함' />
                        <input type="text"
                            className="answer-input input-4"
                            placeholder='예: 설렘 / 달콤' />
                    </div>

                    <div className='button-container'>
                        <button className='page-btn' onClick={()=>setIsModalOpen(true)}> 이전  작품 </button>
                        <button
                            className='page-btn'
                            onClick={() => navigate('cartoon-result')}
                        > 제작하기
                        </button>
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