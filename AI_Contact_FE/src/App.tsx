// import { useState } from "react";
// import "./App.css";
// import MainPage from "./pages/MainPages";

// function App() {
//   return <MainPage />;
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage"; // 기존 메인 페이지
import AuthPage from "./pages/AuthPage"; // 회원가입 페이지
import WebRtcPage from "./webrtc/WebRtcPage"; // 회원가입 페이지

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/webrtc" element={<WebRtcPage />} />
      </Routes>
    </Router>
  );
}

export default App;
