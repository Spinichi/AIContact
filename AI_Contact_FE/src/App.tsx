import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TalkPage from "./pages/TalkRoomPage";
import GalleryPage from "./pages/GalleryPage";
import MainPage from "./pages/MainPage";
import CalendarPage from "./pages/CalendarPage";
import DictionaryPage from "./pages/DictionaryPage";
import MyPage from "./pages/MyPage";
import AuthPage from "./pages/AuthPage";
import WebRtcPage from "./webrtc/WebRtcPage";
import CoupleConnectionPage from "./pages/CoupleConnectionPage";
import CartoonPage from "./pages/CartoonPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/connection" element={<CoupleConnectionPage />} />
        <Route path="/ai" element={<MainPage />} />
        <Route path="/talk" element={<TalkPage />} />
        <Route path="/webrtc" element={<WebRtcPage />} />
        <Route path="/cartoon" element={<CartoonPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
