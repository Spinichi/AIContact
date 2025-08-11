// src/pages/Letters.tsx
import { useState, useEffect, useRef } from "react";
import homeIcon from "../assets/icons/homebtn.png";
import backgroundImage from "../assets/images/talkroom_background.png";
import Sidebar from "../components/Sidebar";
import "../styles/LetterPage.css";
import "../styles/MainPages.css";

import { LetterApi } from "../apis/letter";
import type { LettersResponse } from "../apis/letter";

const LETTER_COOLDOWN_KEY = "lastLetterGeneratedAt"; // 로컬 스토리지 키
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function Letters() {
  const [letters, setLetters] = useState<LettersResponse>([]);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ StrictMode에서 useEffect 두 번 실행되는 것 방지
  const didInit = useRef(false);

  // 오늘 생성 가능 여부
  const canGenerateToday = () => {
    const last = Number(localStorage.getItem(LETTER_COOLDOWN_KEY) || 0);
    return Date.now() - last > ONE_DAY_MS;
  };

  // ✅ 목록 조회
  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await LetterApi.getAll();
      if (res.success) {
        setLetters(res.data);
        if (res.data.length === 0) {
          console.log("📭 도착한 편지가 없습니다.");
        }
      } else {
        setError("편지 조회에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 조용한 자동 생성 (클라이언트 타임아웃 + 실패 무시)
  const generateLetterSilent = async (timeoutMs = 6500) => {
    if (!canGenerateToday()) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort("client-timeout"), timeoutMs);

    try {
      const url =
        `${import.meta.env.VITE_API_BASE_URL}` +
        `${import.meta.env.VITE_API_PREFIX}` +
        `/summary/letter`;

      const res = await fetch(url, {
        method: "GET", // 백엔드 매핑이 GET
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: ctrl.signal,
      });

      if (!res.ok) return; // 실패는 조용히 패스

      const json = await res.json() as { success?: boolean; data?: string };
      if (json?.success && typeof json.data === "string") {
        // 바로 모달로 보여줄 수도 있음
        setSelectedBody(json.data);
        localStorage.setItem(LETTER_COOLDOWN_KEY, String(Date.now()));
      }
    } catch {
      // timeout / 네트워크 실패 무시
    } finally {
      clearTimeout(tid);
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let mounted = true;
    (async () => {
      // 1) 먼저 목록
      await loadList();
      if (!mounted) return;

      // 2) 살짝 딜레이 후 자동 생성 시도 (초기 로딩 경쟁 완화)
      if (canGenerateToday()) {
        setTimeout(async () => {
          await generateLetterSilent(); // 실패해도 조용히
          // 3) 생성 성공/실패와 무관히 목록 동기화
          await loadList();
        }, 1500);
      }
    })();

    return () => {
      mounted = false;
    };
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
