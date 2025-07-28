// import { useState } from "react";
// import "./App.css";
// import MainPage from "./pages/MainPages";

// function App() {
//   return <MainPage />;
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< AI_Contact_FE/src/App.tsx
// import AuthPage from "./pages/AuthPage";
import TalkPage from "./pages/TalkRoomPage";
import GalleryPage from "./pages/GalleryPage";
import MainPage from "./pages/MainPage"; 
import CalendarPage from './pages/CalendarPage';
import DictionaryPage from './pages/DictionaryPage';
import MyPage from './pages/MyPage';
import MainPage from "./pages/MainPage"; // 기존 메인 페이지
import AuthPage from "./pages/AuthPage"; // 회원가입 페이지

=======


>>>>>>> AI_Contact_FE/src/App.tsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
<<<<<<< AI_Contact_FE/src/App.tsx
        <Route path="talk/" element={<TalkPage />} />
        <Route path="gallery/"  element={<GalleryPage />} />
        <Route path="dictionary/" element={<DictionaryPage />} />
        <Route path="calendar/" element={<CalendarPage />} />
        <Route path="mypage/" element={<MyPage />} />
        <Route path="/AuthPage" element={<AuthPage />} />
=======
>>>>>>> AI_Contact_FE/src/App.tsx
      </Routes>
    </Router>
  );
}

export default App;
