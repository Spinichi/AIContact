import React from "react";
import Sidebar from "../components/Sidebar";
import backgroundImage from "../assets/images/whiteboard.svg";
import homeIcon from "../assets/icons/homebtn.png";
import WhitePaper from "../assets/images/WhitePaper.png";

import "../styles/MainPages.css";
import "../styles/CartoonResultPage.css";
import "../styles/CartoonPage.css";
import { useNavigate } from "react-router-dom";

export default function CartoonResultPage() {
  // const navigate = useNavigate();
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="cartoonresult-content">
        <img src={backgroundImage} alt="배경" className="resbackground-img" />
        <div className="board-box">
          <img src={WhitePaper} alt="흰색배경" className="resbackground-img" />
          <div className="photo-card">
            <h2 className="result-title">제작 완료!</h2>
            <div className="result-image">
              <img src="/images/comic4cut.png" alt="네컷만화" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
