import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/DictionaryPage.css";
import Modal from "../components/modal/Modal"

const DictionaryPage: React.FC = () => {
  // ------------------- 상태 -------------------
  
  // 모달 알림 여부 (true일 때, 모달 보임)
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  
  // 모달 모드: create는 새로운 단어 추가, edit는 기존 단어 수정
  const [modalMode, setModalMode] = useState<"create" | "edit">("create"); // 모달 모드

  // 단어입력과 설명 상태 (편집 & 생성 모두 공통으로 사용)
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");

  // ------------------- 이벤트 함수 -------------------
  // create 버튼 클릭 시
  const handleCreateClick = () => {
    setModalMode("create");   // 모달을 생성 모드로
    setTerm("");              // 입력 필드 초기화
    setDescription("");       // 설명 입력창 초기화
    setIsModalOpen(true);     // 모달 열기
  };

  // 편집 버튼 클릭 시
  const handleEditClick = (term: string, description: string) => {
    setModalMode("edit");     // 모달을 편집 모드로
    setTerm(term);            // 선택된 단어를 입력창에 미리 넣어
    setDescription(description);  // 선택된 단어 설명 미리 넣어랑
    setIsModalOpen(true);   // 모달 열어랑
  };

  // 저장 버튼 클릭 시
  const handleSave = () => {
    if (modalMode === "create") {
      // 생성모드일 때 처리
      // 새로운 단어를 배열 or DB에 저장하는 로직 작성
      console.log("새 단어 추가됨:", term, description);
    } else {
      // 편집 로직 작성
      // 단어 업데이트 로직 작성
      console.log("단어 수정됨:", term, description);
    }

    // 모달 닫기
    setIsModalOpen(false);
  };
  // 화면 렌더링
  return (
    <div className="main-layout">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        {/* 상단 헤더 */}
        <div className="user-info-header">
          <h3>애칭 백과사전 📖</h3>
        </div>

        {/* 사전 본문 */}
        <div className="dictionary-container">
          {/* create 버튼 : 새로운 단어 추가 모드로 모달 열기*/}
          <button className="upload-btn" onClick={handleCreateClick}>
            create
          </button>

          <button className="arrow left">〈</button>
          <div className="dictionary-book">
            {/* 왼쪽 페이지 */}
            <div className="dictionary-page">
              <h2>
                빵떡이{" "}
                <span
                  className="wordedit-btn"
                  // 편집 버튼 클릭 시 해당 단어 데이터를 넣은 편집 모달 열기
                  onClick={() =>
                    handleEditClick("빵떡이", "찹쌀떡이나 빵같을 때 쓰는 말임")
                  }
                >
                  편집
                </span>
              </h2>
              <p className="description">
                찹쌀떡이나 빵처럼 보일 때 쓰는 말
              </p>
            </div>

            {/* 오른쪽 페이지 */}
            <div className="dictionary-page">
              <h2>
                빵떡이{" "}
                <span
                  className="wordedit-btn"
                  onClick={() =>
                    handleEditClick("빵떡이", "얼굴이 동글동글하고 통통해서")
                  }
                >
                  편집
                </span>
              </h2>
              <p className="description">얼굴이 동글동글하고 통통해서</p>
            </div>
          </div>
          <button className="arrow right">〉</button>
        </div>

        {/* ------------------- 통합 모달 ------------------- */}
        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} hasNext={false} hasPrev={false}> 
          (
            <div className="modal">
              {/* 모드에 따라 제목 변경 */}
              <h3>{modalMode === "create" ? "새로운 단어 추가" : "단어 편집"}</h3>

              {/* 단어 입력 */}
              <input
                type="text"
                placeholder="단어 입력"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />

              {/* 설명 입력 */}
              <textarea
                placeholder="설명 입력"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="modal-buttons">
                <button onClick={() => setIsModalOpen(false)}>취소</button>
                <button onClick={handleSave}>저장</button>
              </div>
            </div>
        )
        </Modal>}
      </div>
    </div>
  );
};

export default DictionaryPage;
