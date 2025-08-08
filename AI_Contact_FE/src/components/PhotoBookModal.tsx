import prvBtn from "../assets/icons/CaretLeft.svg";
import nxtBtn from "../assets/icons/CaretRight.svg";
import closeBtn from "../assets/icons/WhiteLeftArrow.svg";
import "../styles/Modal.css"; // 기존 Modal.css 재사용

interface PhotoBookModalProps {
  onClose: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  // 즐겨찾기 관련 props
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  // 삭제 관련 props
  onDelete: () => Promise<void>; // 또는 () => void
}

export default function PhotoBookModal({
  onClose,
  hasPrev,
  hasNext,
  children,
  onPrev,
  onNext,
  isFavorite,
  onFavoriteToggle,
  onDelete,
}: PhotoBookModalProps) {
  return (
    <>
      {/* 닫기 버튼 */}
      <img src={closeBtn} className="close-btn" onClick={onClose} alt="닫기" />

      {/* 즐겨찾기 버튼 */}
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={onFavoriteToggle}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* 삭제 버튼 */}
      <button className="delete-btn" onClick={onDelete} title="사진 삭제">
        🗑️
      </button>

      {/* 모달 오버레이 */}
      <div className="modal-overlay">
        {hasPrev && (
          <img src={prvBtn} className="move-btn" onClick={onPrev} alt="이전" />
        )}
        <div className="content">{children}</div>
        {hasNext && (
          <img src={nxtBtn} className="move-btn" onClick={onNext} alt="다음" />
        )}
      </div>
    </>
  );
}
