import React, { useEffect, useState } from "react";
import dictionarybook from "../assets/images/dictionary.png";
import Modal from "../components/modal/Modal";
import Sidebar from "../components/Sidebar";
import "../styles/DictionaryPage.css";
import "../styles/MainPages.css";

import { NicknameApi } from "../apis/nickname/api";
import type { NicknameItem } from "../apis/nickname/response";

// 유틸: ISO 문자열을 'YYYY-MM-DD HH:mm:ss'로 포맷팅
function formatDate(iso: string): string {
  const d = new Date(iso);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

// Raw API 데이터 타입
interface RawNickname {
  id: number;
  nickname: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 로컬 상태 타입: NicknameItem + updated_at
type LocalNickname = NicknameItem & { updated_at: string };

// API 응답을 로컬 타입으로 변환
function mapRawToItem(raw: RawNickname): LocalNickname {
  return {
    id: raw.id,
    word: raw.nickname,
    description: raw.description,
    created_at: formatDate(raw.createdAt),
    updated_at: formatDate(raw.updatedAt),
  };
}

const DictionaryPage: React.FC = () => {
  const [nicknames, setNicknames] = useState<LocalNickname[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // 전체 리스트를 불러오는 함수로 분리 (반환값으로 items 배열 리턴)
  const fetchNicknames = async (): Promise<LocalNickname[]> => {
    try {
      const res = await NicknameApi.getAll();
      const rawList = (res as any).data as RawNickname[];
      const items = rawList.map(mapRawToItem);
      // 숫자 문자열은 숫자 비교, 그 외 문자열은 한글 가나다순 비교
      items.sort((a, b) => {
        const numA = parseFloat(a.word);
        const numB = parseFloat(b.word);
        const isNumA = !isNaN(numA);
        const isNumB = !isNaN(numB);
        if (isNumA && isNumB) {
          return numA - numB;
        }
        return a.word.localeCompare(b.word, "ko");
      });
      setNicknames(items);
      return items;
    } catch (err) {
      console.error("닉네임 목록 불러오기 실패", err);
      return [];
    }
  };

  // 컴포넌트 마운트 시 한 번 불러오기
  useEffect(() => {
    fetchNicknames();
  }, []);

  // 페이징 계산
  const itemsPerPage = 2;
  const totalPages = Math.ceil(nicknames.length / itemsPerPage);
  const start = pageIndex * itemsPerPage;
  const pageItems = nicknames.slice(start, start + itemsPerPage);

  const handlePrevPage = () => setPageIndex((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1));

  // 모달 열기 함수들
  const openCreateModal = () => {
    setModalMode("create");
    setTerm("");
    setDescription("");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: LocalNickname) => {
    setModalMode("edit");
    setTerm(item.word);
    setDescription(item.description ?? "");
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  // 저장 핸들러: 생성/수정 후 항상 리스트 재조회 및 페이지 이동
  const handleSave = async () => {
    try {
      if (modalMode === "create") {
        const createRes = await NicknameApi.create({ word: term, description });
        const rawCreated = (createRes as any).data as RawNickname;
        const createdItem = mapRawToItem(rawCreated);

        const items = await fetchNicknames();
        const newIndex = items.findIndex((it) => it.id === createdItem.id);
        setPageIndex(Math.floor(newIndex / itemsPerPage));
      } else if (modalMode === "edit" && editingId != null) {
        await NicknameApi.update(editingId, { word: term, description });
        const items = await fetchNicknames();
        const updatedIndex = items.findIndex((it) => it.id === editingId);
        setPageIndex(Math.floor(updatedIndex / itemsPerPage));
      }
    } catch (err) {
      console.error("단어 추가/수정 실패", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  // 삭제 핸들러: 삭제 후 리스트 재조회 및 페이지 인덱스 조정
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await NicknameApi.delete(id);
      const items = await fetchNicknames();
      setPageIndex((prev) =>
        Math.min(prev, Math.max(Math.ceil(items.length / itemsPerPage) - 1, 0))
      );
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4># 우리 # 둘만의 </h4>
          <h3>애칭 백과사전 📖</h3>
        </div>
        <div className="dictionary-container">
          <button className="upload-btn" onClick={openCreateModal}>
            애칭 등록
          </button>
          <button
            className="arrow left"
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
          >
            〈
          </button>
          <div className="dictionary-book">
            {pageItems.map((item, idx) => (
              <div
                key={item.id}
                className={`dictionary-page ${idx === 0 ? "left" : "right"}`}
              >
                <h2 className="dictionary-page-header">
                  <span className="page-title">{item.word}</span>
                  <span className="btn-group">
                    <span
                      className="wordedit-btn"
                      onClick={() => openEditModal(item)}
                    >
                      편집
                    </span>
                    <span
                      className="worddelete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      삭제
                    </span>
                  </span>
                </h2>
                <p className="description">{item.description}</p>
                <p className="timestamps">생성 시각: {item.created_at}</p>
                <p className="timestamps">수정 시각: {item.updated_at}</p>
              </div>
            ))}
            <img src={dictionarybook} alt="" className="dictionary-bg" />
          </div>
          <button
            className="arrow right"
            onClick={handleNextPage}
            disabled={pageIndex >= totalPages - 1}
          >
            〉
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          hasNext={false}
          hasPrev={false}
        >
          <div className="modal">
            <h3>{modalMode === "create" ? "새로운 단어 추가" : "단어 편집"}</h3>
            <input
              type="text"
              placeholder="단어 입력"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
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
        </Modal>
      )}
    </div>
  );
};

export default DictionaryPage;
