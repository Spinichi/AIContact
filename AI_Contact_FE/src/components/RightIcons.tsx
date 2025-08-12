import React from "react";
import { useNavigate } from "react-router-dom";

import CartoonIcon from "../assets/icons/CartoonIcon.svg";
import ChatIcon from "../assets/icons/ChatIcon.svg";
import LetterIcon from "../assets/icons/LetterIcon.svg";
import WebrtcIcon from "../assets/icons/WebrtcIcon.svg";

import Dock from "../components/animations/Dock/Dock";
import "../styles/RightIcons.css";

interface RightIconsProps {
  onChatClick: () => void;
}

type DockItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const RightIcons: React.FC<RightIconsProps> = ({ onChatClick }) => {
  const navigate = useNavigate();

  const items: DockItem[] = [
    {
      key: "chat",
      label: "채팅",
      onClick: onChatClick,
      icon: (
        <img
          src={ChatIcon}
          alt="채팅"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
    {
      key: "webrtc",
      label: "영상통화",
      onClick: () => navigate("/webrtc"),
      icon: (
        <img
          src={WebrtcIcon}
          alt="영상통화"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
    {
      key: "cartoon",
      label: "네컷만화",
      onClick: () => navigate("/cartoon"),
      icon: (
        <img
          src={CartoonIcon}
          alt="네컷만화"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
    {
      key: "letters",
      label: "편지함",
      onClick: () => navigate("/letters"),
      icon: (
        <img
          src={LetterIcon}
          alt="편지함"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
  ];

  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70} // Dock 구현에 맞춰 필요 시 조절
    />
  );
};

export default RightIcons;
