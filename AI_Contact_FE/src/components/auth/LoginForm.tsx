import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFromProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFromProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const normalizeToken = (raw: string) =>
    raw
      .trim()
      .replace(/^"+|"+$/g, "")
      .replace(/^Bearer\s+/i, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      // 1) 로그인
      const res = await fetch(`${BASE_URL}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain, application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // 실패 응답 처리
        const ct = res.headers.get("content-type") || "";
        let msg = "로그인 실패";
        if (ct.includes("application/json")) {
          const data = await res.json().catch(() => null);
          if (data?.message) msg = data.message;
        }
        alert(msg);
        return;
      }

      // 2) 토큰 확보(텍스트/JSON 모두 대비)
      let accessToken = "";
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        accessToken = data.accessToken ?? data.token ?? "";
      } else {
        const raw = await res.text();
        accessToken = normalizeToken(raw);
      }

      if (!accessToken) {
        alert("토큰을 받지 못했습니다.");
        return;
      }

      // 3) 토큰 저장(정규화)
      localStorage.setItem("accessToken", normalizeToken(accessToken));

      // 4) 로그인 직후 내 상태 확인 → 라우팅 분기
      const meRes = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${normalizeToken(accessToken)}`,
          Accept: "application/json",
        },
      });

      if (meRes.ok) {
        const me: {
          coupleStatus?: "SINGLE" | "COUPLED" | string;
        } = await meRes.json();

        if (me.coupleStatus === "COUPLED") {
          navigate("/ai", { replace: true }); // 커플이면 바로 /ai
        } else {
          navigate("/connection", { replace: true }); // 싱글이면 커플 연결 페이지
        }
      } else if (meRes.status === 401) {
        // 혹시 로그인 응답은 성공했는데 me 조회가 401이면 토큰 문제 → 재로그인 유도
        localStorage.removeItem("accessToken");
        alert(
          "세션이 만료되었거나 토큰이 유효하지 않습니다. 다시 로그인해 주세요."
        );
      } else {
        // me 조회 실패 시 기본 경로로
        navigate("/connection", { replace: true });
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("로그인에 실패하였습니다.\n아이디와 비밀번호를 확인해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="아이디"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "로그인 중..." : "로그인"}
      </button>
      <p className="toggle-text">
        아직 회원이 아니신가요? <span onClick={onToggle}>회원가입</span>
      </p>
    </form>
  );
}
