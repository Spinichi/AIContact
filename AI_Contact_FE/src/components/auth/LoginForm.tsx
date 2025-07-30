import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFromProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFromProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("accessToken", token);
        navigate("/connection");
      } else {
        const errorData = await response.json();
        alert("로그인 실패");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("로그인에 실패하였습니다.\n아이디와 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="아이디"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">로그인</button>
      <p className="toggle-text">
        아직 회원이 아니신가요? <span onClick={onToggle}>회원가입</span>
      </p>
    </form>
  );
}
