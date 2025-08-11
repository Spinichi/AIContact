import React, { useEffect, useState } from "react";
import photobook from "../assets/images/photobook.png";
import PhotoBookModal from "../components/PhotoBookModal"; // Modal 가져오기
import Sidebar from "../components/Sidebar";
import "../styles/GalleryPage.css";
import "../styles/MainPages.css";

import { MediaApi } from "../apis/media";
import type {
  MediaFileDto,
  MediaThumbnailDto,
  MediaThumbnailListResponse,
  PaginationInfo,
} from "../apis/media/response";

export default function PhotoBook() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("전체");
  const [isTypeDropDownOpen, setIsTypeDropDownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("전체");

  // --- 페이지네이션 상태 수정
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(24);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // --- 썸네일 리스트
  const [thumbs, setThumbs] = useState<MediaThumbnailDto[]>([]);

  // --- 모달용 상세 이미지 & index
  const [fullMedia, setFullMedia] = useState<MediaFileDto | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [viewMode, setViewMode] = useState<"all" | "favorite">("all");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  // 업로드 상태 추가
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".calendar-btn") &&
        !target.closest(".calendar-dropdown")
      ) {
        setIsDropDownOpen(false);
      }
      if (
        !target.closest(".type-filter-btn") &&
        !target.closest(".type-dropdown")
      ) {
        setIsTypeDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 1) 컴포넌트 마운트 시 & 페이지 변경 시 썸네일 로드
  useEffect(() => {
    // selectedYear 가 "2024년" 같은 형태일 때
    let dateFrom: string | undefined;
    let dateTo: string | undefined;
    if (selectedYear !== "전체") {
      const year = selectedYear.replace("년", "");
      dateFrom = `${year}-01-01`;
      dateTo = `${year}-12-31`;
    }

    // selectedType에 따른 fileType 설정
    let fileType: "IMAGE" | "VIDEO" | undefined;
    if (selectedType === "이미지") {
      fileType = "IMAGE";
    } else if (selectedType === "비디오") {
      fileType = "VIDEO";
    } else {
      fileType = undefined; // "전체"인 경우
    }

    MediaApi.fetchThumbnails({
      page: currentPage,
      limit,
      sortDir,
      favoriteOnly: viewMode === "favorite",
      dateFrom, // undefined 이면 쿼리에 아예 빠집니다
      dateTo,
      fileType, // 새로 추가된 필터
    })
      .then((res: MediaThumbnailListResponse) => {
        const mapped = res.mediaFiles
          .map((item) => ({ ...item, isFavorite: item.favorite }))
          .sort((a, b) => {
            // 서버에서 이미 정렬해 줄 경우 이 라인은 지워도 무방
            return sortDir === "desc"
              ? new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              : new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime();
          });
        setThumbs(mapped);
        setPagination(res.pagination);
      })
      .catch(console.error);
  }, [currentPage, limit, viewMode, sortDir, selectedYear, selectedType]);

  // 페이지 이동 함수들
  const handlePrevPage = () => {
    if (pagination?.hasPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 2) 업로드 (이미지/비디오 통합, 순차 업로드)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const allowedVideoExtensions = ["mp4", "mov", "3gp", "mkv"];

    // 파일 검증
    const validFiles = files.filter((file) => {
      if (file.type.startsWith("image/")) {
        return true; // 모든 이미지 허용
      }

      if (file.type.startsWith("video/")) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (extension && allowedVideoExtensions.includes(extension)) {
          return true;
        } else {
          alert(
            `${file.name}: 지원하지 않는 비디오 형식입니다. (mp4, mov, 3gp, mkv만 가능)`
          );
          return false;
        }
      }

      alert(`${file.name}: 지원하지 않는 파일 형식입니다.`);
      return false;
    });

    if (validFiles.length === 0) return;

    // 업로드 시작
    setIsUploading(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    let successCount = 0;
    let failCount = 0;

    // 파일을 하나씩 순차적으로 업로드
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      try {
        console.log(`업로드 중... ${i + 1}/${validFiles.length}: ${file.name}`);
        setUploadProgress({ current: i + 1, total: validFiles.length });

        await MediaApi.uploadImage({ file });
        successCount++;
        console.log(`✅ 업로드 완료: ${file.name}`);
      } catch (error) {
        failCount++;
        console.error(`❌ 업로드 실패: ${file.name}`, error);
      }
    }

    // 업로드 완료
    setIsUploading(false);

    // 모든 업로드 완료 후 목록 갱신
    try {
      const res = await MediaApi.fetchThumbnails({ page: currentPage, limit });
      const sorted = [...res.mediaFiles].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setThumbs(sorted);
      setPagination(res.pagination);

      console.log(`업로드 완료: 성공 ${successCount}개, 실패 ${failCount}개`);
      alert(`업로드 완료!\n성공: ${successCount}개\n실패: ${failCount}개`);
    } catch (error) {
      console.error("목록 갱신 실패:", error);
    }

    // 파일 input 초기화
    e.target.value = "";
  };

  // 3) 썸네일 클릭 → 상세 로드 & 모달 오픈
  const handleThumbnailClick = (id: number, idx: number) => {
    MediaApi.fetchMedia(id)
      .then((media) => {
        setFullMedia({
          ...media,
          favorite: media.favorite,
        });
        setCurrentIndex(idx);
      })
      .catch(console.error);
  };

  // 4) 모달 이전/다음
  const handlePrev = () => {
    if (currentIndex == null) return;
    const prev = (currentIndex + thumbs.length - 1) % thumbs.length;
    handleThumbnailClick(thumbs[prev].id, prev);
  };
  const handleNext = () => {
    if (currentIndex == null) return;
    const next = (currentIndex + 1) % thumbs.length;
    handleThumbnailClick(thumbs[next].id, next);
  };

  const years = ["전체", "2025년", "2024년", "2023년", "2022년"];
  const types = ["전체", "이미지", "비디오"];

  // 5) 모달 닫기
  const handleClose = () => {
    setCurrentIndex(null);
    setFullMedia(null);
  };

  // 6) 즐겨찾기 업데이트 핸들러 (API 호출)
  const handleFavoriteUpdate = async (mediaId: number) => {
    try {
      const response = await MediaApi.toggleFavorite(mediaId);
      const newFav = response.favorite; // ★ response.isFavorite → response.favorite 로

      setThumbs((prev) =>
        prev.map((t) => (t.id === mediaId ? { ...t, isFavorite: newFav } : t))
      );

      if (fullMedia?.id === mediaId) {
        setFullMedia({ ...fullMedia, favorite: newFav });
      }

      console.log(`즐겨찾기 ${newFav ? "추가" : "해제"} 완료`);
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    }
  };

  // 7) 삭제 핸들러 (API 호출)
  const handleDelete = async () => {
    if (!fullMedia) return;

    const confirmDelete = window.confirm("정말로 이 사진을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await MediaApi.deleteMedia(fullMedia.id);

      // 썸네일 리스트에서 삭제된 항목 제거
      setThumbs((prev) => prev.filter((t) => t.id !== fullMedia.id));

      // 모달 닫기
      handleClose();

      console.log("삭제 완료");
      alert("사진이 삭제되었습니다.");

      // 목록 새로고침 (옵션)
      const res = await MediaApi.fetchThumbnails({
        page: currentPage,
        limit,
        sortDir,
        favoriteOnly: viewMode === "favorite",
      });
      const mapped = res.mediaFiles.map((item) => ({
        ...item,
        isFavorite: item.favorite,
      }));
      setThumbs(mapped);
      setPagination(res.pagination);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4># 기록 # 공유 </h4>
          <h3>갤러리 📸</h3>
        </div>
        {/* 필터 / 정렬 / 업로드 영역 */}
        <div className="gallery-top-bar">
          <div className="gallery-tabs">
            <button
              className={viewMode === "all" ? "active" : ""}
              onClick={() => {
                setViewMode("all");
                setCurrentPage(0);
              }}
            >
              전체
            </button>
            <button
              className={viewMode === "favorite" ? "active" : ""}
              onClick={() => {
                setViewMode("favorite");
                setCurrentPage(0);
              }}
            >
              즐겨찾기
            </button>
          </div>
          <div className="gallery-actions">
            <button
              className={`sort-btn ${sortDir === "desc" ? "active" : ""}`}
              onClick={() => {
                setSortDir("desc");
                setCurrentPage(0);
              }}
            >
              최신순
            </button>
            <button
              className={`sort-btn ${sortDir === "asc" ? "active" : ""}`}
              onClick={() => {
                setSortDir("asc");
                setCurrentPage(0);
              }}
            >
              오래된순
            </button>

            {/* 달력 버튼 */}
            <button
              className="calendar-btn"
              onClick={() => {
                setIsDropDownOpen((o) => !o);
                setIsTypeDropDownOpen(false); // 다른 드롭다운 닫기
              }}
            >
              📅
              {isDropDownOpen && (
                <div className="calendar-dropdown">
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`dropdown-item ${
                        selectedYear === year ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsDropDownOpen(false);
                        setCurrentPage(0);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </button>

            {/* 타입 필터 영역 - 드롭다운을 버튼 밖으로 이동 */}
            <div className="type-filter-wrapper">
              <button
                className={`type-filter-btn ${
                  isTypeDropDownOpen ? "active" : ""
                }`}
                onClick={() => {
                  setIsTypeDropDownOpen((o) => !o);
                  setIsDropDownOpen(false); // 다른 드롭다운 닫기
                }}
              >
                📁
              </button>
              {isTypeDropDownOpen && (
                <div className="type-dropdown">
                  {types.map((type) => (
                    <div
                      key={type}
                      className={`dropdown-item ${
                        selectedType === type ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedType(type);
                        // setIsTypeDropDownOpen(false); // 이 줄 제거 - 드롭다운 유지
                        setCurrentPage(0);
                      }}
                    >
                      {type === "전체" && "📁 전체"}
                      {type === "이미지" && "🖼️ 이미지"}
                      {type === "비디오" && "🎬 비디오"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="upload-label">
              🖼️ 업로드
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
              />
            </label>

            <label className="upload-label">
              🎬 업로드
              <input
                type="file"
                multiple
                accept=".mp4,.mov,.3gp,.mkv"
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>

        {/* 앨범 */}
        <div className="photobook-wrapper">
          <div className="photobook">
            {/* 이전 페이지 버튼 */}
            <button
              className="page-nav-btn prev"
              onClick={handlePrevPage}
              disabled={!pagination?.hasPrevious}
            >
              &#8249;
            </button>

            {/* 왼쪽 사진 - 항상 12개 박스 렌더링 */}
            <div className="photo-grid left">
              {Array.from({ length: 12 }).map((_, i) => (
                <div className="photo-box" key={`left-${i}`}>
                  {thumbs[i] && (
                    <img
                      src={thumbs[i].thumbnailUrl}
                      alt={`thumb-${thumbs[i].id}`}
                      onClick={() => handleThumbnailClick(thumbs[i].id, i)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 오른쪽 사진 - 항상 12개 박스 렌더링 */}
            <div className="photo-grid right">
              {Array.from({ length: 12 }).map((_, i) => (
                <div className="photo-box" key={`right-${i}`}>
                  {thumbs[i + 12] && (
                    <img
                      src={thumbs[i + 12].thumbnailUrl}
                      alt={`thumb-${thumbs[i + 12].id}`}
                      onClick={() =>
                        handleThumbnailClick(thumbs[i + 12].id, i + 12)
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 다음 페이지 버튼 */}
            <button
              className="page-nav-btn next"
              onClick={handleNextPage}
              disabled={!pagination?.hasNext}
            >
              &#8250;
            </button>

            {/* 배경 */}
            <img
              src={photobook}
              alt="photobook background"
              className="photobook-bg"
            />
          </div>

          {/* 페이지 정보 표시 */}
          {pagination && pagination.totalPages > 1 && (
            <div className="page-info">
              {pagination.currentPage + 1} / {pagination.totalPages}
            </div>
          )}
        </div>
      </div>

      {/* 업로드 로딩 오버레이 */}
      {isUploading && (
        <div className="upload-overlay">
          <div className="upload-modal">
            <div className="upload-spinner">⏳</div>
            <h3>파일 업로드 중...</h3>
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (uploadProgress.current / uploadProgress.total) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p>
                {uploadProgress.current} / {uploadProgress.total} 완료
              </p>
            </div>
            <p>잠시만 기다려주세요...</p>
          </div>
        </div>
      )}

      {/* PhotoBook 전용 모달 사용 */}
      {currentIndex !== null && fullMedia && (
        <PhotoBookModal
          onClose={handleClose}
          hasPrev={true}
          hasNext={true}
          onPrev={handlePrev}
          onNext={handleNext}
          isFavorite={fullMedia.favorite}
          onFavoriteToggle={() => handleFavoriteUpdate(fullMedia.id)}
          onDelete={handleDelete}
        >
          {fullMedia.fileType === "VIDEO" ? (
            <video
              src={fullMedia.fileUrl}
              controls
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          ) : (
            <img
              src={fullMedia.fileUrl}
              alt="full-media"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </PhotoBookModal>
      )}
    </div>
  );
}
