import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CouplesApi } from "../../apis/couple";
import heart from "../../assets/images/heart.png";
import "../../styles/CoupleConnection.css";
import { aiChildApi } from "../../apis/aiChild";
import AdditionalInfoModal, { type formDataType } from "../modal/AdditionalInfoModal";
import { createPortal } from "react-dom";
import type { ApiResponse } from "../../apis/types/common";
import type { CoupleInfoResponse } from "../../apis/couple/response";
import Particles from "../auth/Particles";
import Loading from "../animations/Loading";
import type React from "react";

export default function PartnerConnectionForm() {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [isStarting, setIsStarting] = useState(false); // 초기 버튼 클릭 시 로딩 상태
  const [isFinalizing, setIsFinalizing] = useState(false); // 최종 제출 시 로딩 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 백그라운드 작업의 Promise를 저장할 ref
  const backgroundTaskPromiseRef = 
      useRef<Promise<ApiResponse<CoupleInfoResponse>> | null>(null);

  const matchingTask = async (partnerId : number) => {
    const matchingResult = await CouplesApi.matching({ partnerId });
    return matchingResult;
  };

  const updateChildInfoTask = async (childName: string) => {
    const aiInfo = await aiChildApi.getMyChildren();
    const childId = aiInfo.data.id;
    return aiChildApi.updateChild(childId, {
      name: childName,
      imageUrl: aiInfo.data.imageUrl, 
      growthLevel: aiInfo.data.growthLevel, 
      experiencePoints: aiInfo.data.experiencePoints
    });
  };

  const handleStartConnection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isStarting || isFinalizing) return;

    setIsStarting(true);
    setErrorMsg("");

    try { 
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("로그인이 필요합니다.");
        setSubmitting(false);
        return;
      }

      const joinRes = await CouplesApi.joinByCode(code.trim());
      const join = joinRes.data;

      if (!join.matched || !join.partnerId) {
        throw new Error("매칭할 수 없습니다. 상대의 상태를 확인해 주세요.");
      }

      // 성공 시, 백그라운드 작업을 시작하고 Promise를 ref에 저장
      console.log("백그라운드 작업 시작!");
      backgroundTaskPromiseRef.current = matchingTask(join.partnerId);

      setIsModalOpen(true);
    } catch (err: unknown) {
      const msg = 
          err instanceof Error
          ? err.message
          : "잘못된 코드입니다. 다시 확인해 주세요.";
      setErrorMsg(msg);
      console.error(e);
    } finally {
      setIsStarting(false);
    }
  };

  const handleFinalSubmit = async (modalData: formDataType) => {
    setErrorMsg("");
    setIsFinalizing(true);
    try {
      const matchingResult = await backgroundTaskPromiseRef.current;
      const patchCoupleResult = await CouplesApi.patchCouple({
        coupleName: modalData.coupleName, 
        startDate: modalData.coupleDate
      });
      const updateChildResult = await updateChildInfoTask(modalData.childName);    
      console.log("모든 프로세스 최종 완료!", { matchingResult, patchCoupleResult, updateChildResult });
      alert("연결 및 모든 설정이 완료되었습니다!");
      setIsModalOpen(false);
      navigate("/ai");
    } catch (e: any) {
      setErrorMsg(e.message || "최종 처리 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <>
    <form className="connection-container" onSubmit={handleStartConnection}>
      <div className="heart">
        <img src={heart} alt="heart" />
      </div>

      <p className="code-label">연인의 커플 코드를 입력해 주세요.</p>
      <input
        type="text"
        placeholder="코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "연결 중..." : "연결하기"}
      </button>

      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </form>
    {isModalOpen &&
      createPortal(    
        <AdditionalInfoModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFinalSubmit}
        />, 
      document.body)
    }
    {isFinalizing ? (createPortal(
        <>
          <div className="loading-background">
            <Particles
              particleColors={["#735AE1", "#A66EE0", "#ffffff"]}
              particleCount={300}
              particleSpread={10}
              speed={0.2}
              particleBaseSize={1000}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
              cameraDistance={10}
            />
            <Loading />
          </div>
        </>
      , document.body)) : (
        <></>
      ) }
    </>
  );
}
