import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import backgroundImage from '../assets/images/talkroom_background.png';
import homeIcon from '../assets/icons/homebtn.png';
import '../styles/MainPages.css';
import '../styles/LetterPage.css';

interface Letter {
  id: number;
  title: string;
  body: string;
}

export default function Letters() {
  const mockLetters: Letter[] = [
    { id: 1, title: '첫 번째 편지', body: '정말 오랜만이야...\n이렇게 편지를 쓰는 건 처음이네.' },
    { id: 2, title: '여름 방학 계획', body: '바다도 가고 캠핑도 가고...\n너의 생각은 어때?' },
    { id: 3, title: '축하해!', body: '합격 소식 정말 기뻐!\n다 같이 모여서 파티하자.' },
    { id: 4, title: '오랜만이야', body: '…(본문이 길어요)…' },
    // 더미 데이터 추가 가능
  ];

  const [letters] = useState<Letter[]>(mockLetters);
  const [selected, setSelected] = useState<Letter | null>(null);

  return (
    <div className='main-layout'>
      <Sidebar />
      <div
        className='letter-content'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img src={homeIcon} alt='홈' className='letter-icon-img' />

        {/* 편지 그리드 */}
        <div className="letters-container">
          {letters.map(letter => (
            <div
              key={letter.id}
              className="letter-box"
              onClick={() => setSelected(letter)}
            >
              <h4>{letter.title}</h4>
            </div>
          ))}
        </div>

        {/* 상세 모달 */}
        {selected && (
          <div className="letter-modal-backdrop" onClick={() => setSelected(null)}>
            <div className="letter-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelected(null)}>
                ×
              </button>
              <h2>{selected.title}</h2>
              <pre className="modal-body">{selected.body}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
