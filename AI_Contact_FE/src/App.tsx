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

import MainPage from "./pages/MainPage"; // 기존 메인 페이지

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="talk/" element={<TalkPage />} />
        {/* <Route path="/AuthPage" element={<AuthPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
