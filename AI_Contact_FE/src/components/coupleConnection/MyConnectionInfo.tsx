import { useEffect, useState } from "react";
import "../../styles/CoupleConnection.css";
import { apiFetch } from "../../api/fetchClient";
import placeholderImg from "../../assets/images/symbol.png";

type MeUserResponse = {
  id: number;
  email: string;
  name: string;
  profile_image_url: string | null;
  birth_date: string | null;
  couple_status: "SINGLE" | "COUPLED" | string;
  created_at: string;
  updated_at: string;
};

type MyCodeResponse = {
  verification_code: string;
};

export default function MyConnectionInfo() {
  const [verificationCode, setVerificationCode] = useState("");
  const [profileImageUrl, setProfileImageUrl] =
    useState<string>(placeholderImg);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("로그인이 필요합니다.");
        return;
      }

      try {
        const [me, myCode] = await Promise.all([
          apiFetch<MeUserResponse>("/api/v1/users/me", {
            signal: controller.signal,
          }),
          apiFetch<MyCodeResponse>("/api/v1/couples/myCode", {
            signal: controller.signal,
          }),
        ]);

        // 프로필 이미지 설정 (없으면 플레이스홀더)
        setProfileImageUrl(me.profile_image_url || placeholderImg);

        // 인증 코드 설정
        setVerificationCode(myCode.verification_code ?? "");

        setErrorMsg("");
      } catch (e: any) {
        if (e.message === "UNAUTHORIZED") {
          localStorage.removeItem("accessToken");
          setErrorMsg("세션이 만료되었습니다. 다시 로그인해 주세요.");
        } else if (e.message === "FORBIDDEN") {
          setErrorMsg("접근 권한이 없습니다.");
        } else if (e.name !== "AbortError") {
          setErrorMsg("정보를 불러오는 중 오류가 발생했습니다.");
        }
        console.error(e);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  return (
    <div className="connection-container">
      <div className="profile-container">
        <img
          src={profileImageUrl}
          alt="프로필"
          onError={(e) => {
            // 이미지 로드 실패 시 플레이스홀더로 대체
            (e.currentTarget as HTMLImageElement).src = placeholderImg;
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>

      <p className="code-label">당신의 코드</p>
      <p className="code">{verificationCode || "-"}</p>

      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

      <button>공유하기</button>
    </div>
  );
}
