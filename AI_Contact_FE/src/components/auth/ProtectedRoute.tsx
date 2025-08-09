// src/components/auth/ProtectedRoute.tsx
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

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken");

      // 1) 토큰 자체 없거나 만료면 즉시 컷
      if (!token || isJwtExpired(token)) {
        localStorage.removeItem("accessToken");
        setOk(false);
        setLoading(false);
        return;
      }

      // 2) 서버 검증(지연 방지용 타임아웃)
      try {
        const res = await withTimeout(UsersApi.getMe(), 5000);
        const me: any = (res as any)?.data;
        if (me?.id) {
          setOk(true);
        } else {
          localStorage.removeItem("accessToken");
          setOk(false);
        }
      } catch {
        localStorage.removeItem("accessToken");
        setOk(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  return ok ? <Outlet /> : <Navigate to="/auth" replace />;
}
