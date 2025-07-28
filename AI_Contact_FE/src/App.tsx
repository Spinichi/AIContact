// import { useState } from "react";
// import "./App.css";
// import MainPage from "./pages/MainPages";

// function App() {
//   return <MainPage />;
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthPage from "./pages/AuthPage";
import TalkPage from "./pages/TalkRoomPage";
import GalleryPage from "./pages/GalleryPage";
import MainPage from "./pages/MainPage"; 
import CalendarPage from './pages/CalendarPage';
import DictionaryPage from './pages/DictionaryPage';
import MyPage from './pages/MyPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="talk/" element={<TalkPage />} />
        <Route path="gallery/"  element={<GalleryPage />} />
        <Route path="dictionary/" element={<DictionaryPage />} />
        <Route path="calendar/" element={<CalendarPage />} />
        <Route path="mypage/" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
