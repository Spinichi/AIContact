// import { useState } from "react";
// import "./App.css";
// import MainPage from "./pages/MainPages";

// function App() {
//   return <MainPage />;
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage"; // 회원가입 페이지
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CoupleConnectionPage from "./pages/CoupleConnectionPage";
import TalkPage from "./pages/TalkRoomPage";
import WebRtcPage from "./webrtc/WebRtcPage";
import GalleryPage from "./pages/GalleryPage";
import CalendarPage from "./pages/CalendarPage";
import DictionaryPage from "./pages/DictionaryPage";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/connection" element={<CoupleConnectionPage />} />
          <Route path="/ai" element={<MainPage />} />
          <Route path="/talk" element={<TalkPage />} />
          <Route path="/webrtc" element={<WebRtcPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
