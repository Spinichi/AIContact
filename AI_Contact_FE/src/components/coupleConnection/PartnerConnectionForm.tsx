import { useState } from "react";
import "../../styles/CoupleConnection.css";
import heart from "../../assets/images/heart.png";
import { CouplesApi } from "../../apis/couple";
import { useNavigate } from "react-router-dom";

export default function PartnerConnectionForm() {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrorMsg("로그인이 필요합니다.");
      setSubmitting(false);
      return;
    }

    try {
      const joinRes = await CouplesApi.joinByCode(code.trim());
      const join = joinRes.data;

      if (!join.matched || !join.partnerId) {
        setErrorMsg("매칭할 수 없습니다. 상대의 상태를 확인해 주세요.");
        setSubmitting(false);
        return;
      }

      await CouplesApi.matching({ partnerId: join.partnerId });

      alert("연결이 완료되었습니다!");
      navigate("/connection");
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg === "UNAUTHORIZED") {
        setErrorMsg("세션이 만료되었습니다. 다시 로그인해 주세요.");
      } else if (msg === "FORBIDDEN") {
        setErrorMsg("접근 권한이 없습니다.");
      } else {
        setErrorMsg("잘못된 코드입니다. 다시 확인하고 입력해 주세요.");
      }
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="connection-container" onSubmit={onSubmit}>
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
  );
}
