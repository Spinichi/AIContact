import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/CalendarPage.css";

const CalendarPage: React.FC = () => {
  return (
    <div className="main-layout">
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        {/* 상단 타이틀 */}
        <div className="user-info-header">
          <h3>캘린더</h3>
        </div>

        {/* 캘린더 영역 */}
        <div className="calendar-container">
          {/* 상단 년월 */}
          <div className="calendar-header">
            <button className="arrow-btn">〈</button>
            <h2>2025년 8월</h2>
            <button className="arrow-btn">〉</button>
          </div>

          {/* 달력 테이블 */}
          <table className="calendar-table">
            <thead>
              <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
            </thead>
            <tbody>
              {/* 더미 데이터 예시 */}
              <tr>
                <td className="prev-month">27</td>
                <td className="prev-month">28</td>
                <td className="prev-month">29</td>
                <td className="prev-month">30</td>
                <td className="prev-month">31</td>
                <td>1</td>
                <td>2</td>
              </tr>
              <tr>
                <td className="holiday">3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
                <td>9</td>
              </tr>
              <tr>
                <td className="holiday">10</td>
                <td>11</td>
                <td>12</td>
                <td>13</td>
                <td>14</td>
                <td className="event">
                  15
                  <div className="event-label">광복절</div>
                </td>
                <td>16</td>
              </tr>
              {/* 필요 시 추가 행 */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
