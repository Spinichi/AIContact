// src/pages/Letters.tsx
import { useState, useEffect } from "react";
import homeIcon from "../assets/icons/homebtn.png";
import backgroundImage from "../assets/images/talkroom_background.png";
import Sidebar from "../components/Sidebar";
import "../styles/LetterPage.css";
import "../styles/MainPages.css";

import { LetterApi } from "../apis/letter";
import type { LettersResponse } from "../apis/letter";

export default function Letters() {
  const [letters, setLetters] = useState<LettersResponse>([]);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    LetterApi.getAll()
      .then((res) => {
        if (res.success) {
          if (res.data.length === 0) {
            console.log("📭 도착한 편지가 없습니다.");
          }
          setLetters(res.data);
        } else {
          setError("편지 조회에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("서버 에러가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-layout">
      <Sidebar />
      <div
        className="letter-content"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img src={homeIcon} alt="홈" className="letter-icon-img" />

        {loading && <div className="status">로딩 중...</div>}
        {error && <div className="status error">{error}</div>}

        {!loading && !error && letters.length === 0 && (
          <div className="status">📭 도착한 편지가 없습니다.</div>
        )}

        {!loading && !error && letters.length > 0 && (
          <div className="letters-container">
            {letters.map((body, idx) => (
              <div
                key={idx}
                className="letter-box"
                onClick={() => setSelectedBody(body)}
              >
                <h4>{`편지 ${idx + 1}`}</h4>
              </div>
            ))}
          </div>
        )}

        {selectedBody && (
          <div
            className="letter-modal-backdrop"
            onClick={() => setSelectedBody(null)}
          >
            <div
              className="letter-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedBody(null)}
              >
                ×
              </button>
              <pre className="modal-body">{selectedBody}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
