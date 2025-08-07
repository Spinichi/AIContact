import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ComicStripsApi } from "../apis/comicStrips";
import homeIcon from "../assets/icons/homebtn.png";
import ComicBook from "../assets/images/comicbook.png";
import backgroundImage from "../assets/images/whiteboard.svg";
import Cartoon from "../components/cartoon/Cartoon";
import Modal from "../components/modal/Modal";
import Sidebar from "../components/Sidebar";
import "../styles/Cartoon.css";
import "../styles/CartoonPage.css";
import "../styles/MainPages.css";

import type { ComicStripsListResponse } from "../apis/comicStrips";

export default function CartoonPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comicList, setComicList] = useState<ComicStripsListResponse[]>([]);
  const [index, setIndex] = useState(0);

  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("");
  const [weather, setWeather] = useState("");

  const cartoonLayout = (
    <div
      className="cartoon-detail"
      style={{ backgroundImage: `url(${ComicBook})` }}
    >
      {comicList[index] && (
        <Cartoon
          date={new Date(comicList[index].createdAt)}
          image_url={comicList[index].imageUrl}
          title={comicList[index].title ?? ""}
        />
      )}
      {comicList[index + 1] && (
        <Cartoon
          date={new Date(comicList[index + 1].createdAt)}
          image_url={comicList[index + 1].imageUrl}
          title={comicList[index + 1].title ?? ""}
        />
      )}
    </div>
  );

  const prevImage = () => {
    setIndex(
      index === 0 ? Math.floor((comicList.length - 1) / 2) * 2 : index - 2
    );
  };

  const nextImage = () => {
    setIndex(index + 2 >= comicList.length ? 0 : index + 2);
  };

  const handleCreateComic = async () => {
    if (!location || !activity || !weather) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    try {
      setIsLoading(true);
      const res = await ComicStripsApi.create({ location, activity, weather });
      navigate("/cartoon-result", {
        state: {
          imageUrl: res.data.imageUrl,
          id: res.data.id,
        },
      });
    } catch (error) {
      console.error(error);
      alert("만화 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreviousComics = async () => {
    try {
      const res = await ComicStripsApi.getList();
      setComicList(res.data);
      setIndex(0);
      setIsModalOpen(true);
    } catch (error) {
      console.error("만화 목록 로딩 실패", error);
      alert("이전 작품을 불러오는 데 실패했습니다.");
    }
  };

  return (
    <div className="main-layout">
      {isModalOpen &&
        createPortal(
          <Modal
            onClose={() => setIsModalOpen(false)}
            hasPrev={true}
            hasNext={true}
            onPrev={prevImage}
            onNext={nextImage}
          >
            {cartoonLayout}
          </Modal>,
          document.body
        )}

      <Sidebar />

      <div className="cartoon-content">
        <img src={backgroundImage} alt="배경" className="background-img" />
        <img
          src={homeIcon}
          alt="홈"
          className="home-icon-img"
          onClick={() => navigate("/ai")}
        />

        <div className="cartoon-header">
          <div className="hashtags">
            <span>#재미있는</span>
            <span>#네컷만화</span>
          </div>
          <div className="title-box">
            <h1>포비의 네컷만화 제작소</h1>
          </div>
        </div>

        <div className="board-box">
          <div className="board-box-title">
            <div>한 단어 또는 짧은 문장으로 오늘 하루를 표현해주세요!</div>
            <div>그럼 제가 4컷 만화로 표현해 드릴게요!</div>
          </div>

          <div className="input-overlay">
            <div className="answer-input-title">
              장소
              <input
                type="text"
                className="answer-input input-1"
                placeholder="예: 제주도 / 놀이공원 / 서울숲"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="answer-input-title">
              활동
              <input
                type="text"
                className="answer-input input-2"
                placeholder="예: 해변 산책 / 영화보기 / 떡볶이"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </div>
            <div className="answer-input-title">
              날씨 또는 계절
              <input
                type="text"
                className="answer-input input-3"
                placeholder="예: 맑음 / 여름"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              />
            </div>
          </div>

          <div className="button-container">
            <button className="page-btn" onClick={fetchPreviousComics}>
              이전 작품
            </button>
            <button
              className="page-btn"
              onClick={handleCreateComic}
              disabled={isLoading}
            >
              {isLoading ? "생성 중..." : "제작하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
