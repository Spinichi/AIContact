// src/apis/letters/useUnreadLettersCount.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { LetterApi } from "./index";

/** 간단한 문자열 해시(djb2) */
function hashStr(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  // 부호 없는 32bit 문자열로
  return String(h >>> 0);
}

const SEEN_KEY = (userId?: string | number | null) =>
  userId != null ? `lettersSeenHashes:u:${userId}` : `lettersSeenHashes`;

function getSeenSet(userId?: string | number | null): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY(userId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveSeenSet(seen: Set<string>, userId?: string | number | null) {
  try {
    localStorage.setItem(SEEN_KEY(userId), JSON.stringify([...seen]));
  } catch {
    // ignore quota errors
  }
}

async function fetchLetterHashes(): Promise<string[]> {
  // 서버: GET /summary/letters → string[] (본문들)
  const res = await LetterApi.getAll();
  if (!res.success || !Array.isArray(res.data)) return [];
  // 본문을 해시로 변환해 중복/순서 변화에 강인하게 관리
  return res.data.map(hashStr);
}

async function getUnreadCountLocal(userId?: string | number | null) {
  const seen = getSeenSet(userId);
  const hashes = await fetchLetterHashes();
  let cnt = 0;
  for (const h of hashes) if (!seen.has(h)) cnt++;
  return cnt;
}

async function markAllAsReadLocal(userId?: string | number | null) {
  const seen = getSeenSet(userId);
  const hashes = await fetchLetterHashes();
  hashes.forEach(h => seen.add(h));
  // 사이즈가 너무 커지면 최근 것 위주로 슬림화
  if (seen.size > 5000) {
    const keep = new Set(hashes.slice(-1000));
    saveSeenSet(keep, userId);
  } else {
    saveSeenSet(seen, userId);
  }
}

function markOneAsReadLocal(body: string, userId?: string | number | null) {
  const seen = getSeenSet(userId);
  seen.add(hashStr(body));
  saveSeenSet(seen, userId);
}

/**
 * 백엔드 없이(localStorage 기반) 미읽음 편지 개수 훅
 * - /summary/letters 결과(string[])를 해시로 비교하여 미읽음 계산
 * - pollMs 지정 시 주기적으로 갱신
 * - userId를 주면 계정별로 분리 저장(없어도 동작)
 */
export function useUnreadLettersCount(options?: { pollMs?: number; userId?: string | number | null }) {
  const { pollMs, userId = null } = options || {};

  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setError(null);
      const c = await getUnreadCountLocal(userId);
      setCount(c);
    } catch {
      setError("안 읽은 편지 갯수를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchCount();
    })();
    if (!pollMs) return;
    const id = setInterval(() => {
      if (mounted) fetchCount();
    }, pollMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [fetchCount, pollMs]);

  // 편하게 쓰라고 훅에서도 바로 제공
  const markAllAsRead = useCallback(async () => {
    await markAllAsReadLocal(userId);
    // 모두 읽음 처리 후 즉시 새로 계산
    await fetchCount();
  }, [userId, fetchCount]);

  const markOneAsRead = useCallback(async (body: string) => {
    markOneAsReadLocal(body, userId);
    await fetchCount();
  }, [userId, fetchCount]);

  // 필요 시 외부에서 강제 갱신
  const api = useMemo(() => ({
    markAllAsRead,
    markOneAsRead,
    refetch: fetchCount,
  }), [markAllAsRead, markOneAsRead, fetchCount]);

  return { count, loading, error, ...api };
}
