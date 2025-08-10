import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UsersApi } from "../../apis/user/api";

function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return !payload?.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      }
    );
  });
}

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [redirectReason, setRedirectReason] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken");

      // 1) 클라이언트 단에서 만료/부재면 즉시 로그아웃 처리
      if (!token || isJwtExpired(token)) {
        localStorage.removeItem("accessToken");
        setOk(false);
        setRedirectReason("token-expired");
        setLoading(false);
        return;
      }

      // 2) 서버 검증
      try {
        const res = await withTimeout(UsersApi.getMe(), 5000);
        const me: any = (res as any)?.data;
        if (me?.id) {
          setOk(true);
        } else {
          // 형식은 정상인데 me가 없으면 인증 실패로 간주
          localStorage.removeItem("accessToken");
          setOk(false);
          setRedirectReason("unauthorized");
        }
      } catch (err: any) {
        const status = err?.response?.status as number | undefined;

        if (status === 500) {
          // 서버 500이면 /auth로 보냄
          localStorage.removeItem("accessToken");
          setOk(false);
          setRedirectReason("server-500");
        } else if (status === 401 || status === 403) {
          // 보통 만료/권한 없음
          localStorage.removeItem("accessToken");
          setOk(false);
          setRedirectReason("unauthorized");
        } else if (err?.message === "timeout") {
          // 타임아웃: 필요시 다른 화면으로 보내거나 재시도 로직 추가 가능
          setOk(false);
          setRedirectReason("timeout");
        } else {
          // 기타 네트워크/미정의 에러
          setOk(false);
          setRedirectReason("unknown");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return;
  if (ok) return <Outlet />;

  return <Navigate to="/auth" replace state={{ reason: redirectReason }} />;
}
