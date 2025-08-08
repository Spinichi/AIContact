import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "../styles/CalendarPage.css";
import "../styles/MainPages.css";

import AddSchedule from "../components/calendar/AddSchedule";
import CalendarDetail from "../components/calendar/CalendarDetail";
import Modal from "../components/modal/Modal";
import Sidebar from "../components/Sidebar";

import {
  type DatesSetArg,
  type DayCellContentArg,
  type EventInput,
} from "@fullcalendar/core/index.js";
import koLocale from "@fullcalendar/core/locales/ko";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // 'timeGridWeek' 뷰를 위해 필요합니다.
import { dailySchedulesApi } from "../apis/dailySchedule";
import type { DailyScheduleResponse } from "../apis/dailySchedule/response";
import EditSchedule from "../components/calendar/EditSchedule";

export default function CalendarPage() {
  type ModalType = "detail" | "add" | "edit" | "off";

  const initialScheduleData: DailyScheduleResponse = {
    id: 0,
    title: "",
    memo: "",
    scheduleDate: "",
    createdAt: "",
    updatedAt: "",
  };

  const [modalStatus, setModalStatus] = useState<ModalType>("off");
  const [clickedDateInfo, setClickedDateInfo] = useState<DateClickArg | null>(
    null
  );
  const [editScheduleData, setEditScheduleData] =
    useState<DailyScheduleResponse>(initialScheduleData);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dailySchedulesApi.getSchedulesByMonth(
          year,
          month
        );
        const eventsData = response.data;
        const processedData = eventsData.map((element) => ({
          title: element.title,
          start: element.scheduleDate,
        }));
        setEvents(processedData);
      } catch (e) {
        /* empty */
      }
    };

    fetchData();
  }, [refetchTrigger]);

  function openCalendarDetail(dateInfo: DateClickArg) {
    setClickedDateInfo(dateInfo);
    setModalStatus("detail");
  }

  const handleDayCellContent = (e: DayCellContentArg) => {
    const dayNumber = e.dayNumberText.replace("일", "");
    return dayNumber;
  };

  const handleNextDay = () => {
    if (!clickedDateInfo) return;

    const currentDate = new Date(clickedDateInfo.date);
    currentDate.setDate(currentDate.getDate() + 1);

    setClickedDateInfo((prev) => ({
      ...prev!,
      date: currentDate,
      dateStr: currentDate.toISOString(),
    }));
  };

  const handlePrevDay = () => {
    if (!clickedDateInfo) return;

    const currentDate = new Date(clickedDateInfo.date);
    currentDate.setDate(currentDate.getDate() - 1);

    setClickedDateInfo((prev) => ({
      ...prev!,
      date: currentDate,
      dateStr: currentDate.toISOString(),
    }));
  };

  function handleDailyScheduleSumbit() {
    alert("일정이 등록되었습니다.");
    setModalStatus("off");
    setRefetchTrigger((prev) => prev + 1);
  }

  function handleDailyScheduleDelete() {
    alert("일정이 삭제되었습니다.");
    setModalStatus("off");
    setRefetchTrigger((prev) => prev + 1);
  }

  function handleScheduleEdit(scheduleData: DailyScheduleResponse) {
    setEditScheduleData(scheduleData);
    setModalStatus("edit");
  }

  const updateDate = (dateInfo: DatesSetArg) => {
    setYear(dateInfo.view.currentStart.getFullYear());
    setMonth(dateInfo.view.currentStart.getMonth() + 1);
    setRefetchTrigger((prev) => prev + 1);
  };

  function setModalContent(modalStatus: ModalType) {
    switch (modalStatus) {
      case "off":
        return null;
      case "detail":
        return (
          <Modal
            onClose={() => setModalStatus("off")}
            hasNext={true}
            hasPrev={true}
            onPrev={handlePrevDay}
            onNext={handleNextDay}
          >
            {clickedDateInfo && (
              <CalendarDetail
                dateInfo={clickedDateInfo.date}
                onAdd={() => setModalStatus("add")}
                onDelete={handleDailyScheduleDelete}
                onEdit={handleScheduleEdit}
              />
            )}
          </Modal>
        );
      case "add":
        return (
          <Modal
            onClose={() => setModalStatus("off")}
            hasNext={false}
            hasPrev={false}
          >
            {clickedDateInfo && (
              <AddSchedule
                dateInfo={clickedDateInfo.date}
                onCancel={() => setModalStatus("detail")}
                onDailyScheduleSubmit={handleDailyScheduleSumbit}
              />
            )}
          </Modal>
        );
      case "edit":
        return (
          <Modal
            onClose={() => setModalStatus("off")}
            hasNext={false}
            hasPrev={false}
          >
            {clickedDateInfo && (
              <EditSchedule
                scheduleInfo={editScheduleData}
                dateInfo={clickedDateInfo.date}
                onCancel={() => setModalStatus("detail")}
                onDailyScheduleSubmit={handleDailyScheduleSumbit}
              />
            )}
          </Modal>
        );
    }
  }

  return (
    <div className="main-layout">
      {modalStatus != "off" &&
        createPortal(setModalContent(modalStatus), document.body)}
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        {/* 상단 타이틀 */}
        <div className="user-info-header">
          <h3>캘린더</h3>
        </div>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={false}
            events={events}
            aspectRatio={1.6}
            locale={koLocale}
            headerToolbar={{
              left: "prev,title,next",
              center: "",
              right: "today",
            }}
            dayCellContent={handleDayCellContent}
            displayEventTime={false}
            dayMaxEventRows={true}
            dayMaxEvents={2}
            dateClick={openCalendarDetail}
            timeZone={"UTC"}
            datesSet={updateDate}
            defaultTimedEventDuration={"00:01"}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
