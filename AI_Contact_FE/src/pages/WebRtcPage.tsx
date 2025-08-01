import {
  LocalVideoTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import { useEffect, useMemo, useRef, useState } from "react";
import VideoComponent from "../components/webrtc/VideoComponent";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/icons/ArrowLeft.svg";
import WebrtcAiOff from "../assets/icons/WebrtcAiOff.svg";
import WebrtcAiOn from "../assets/icons/WebrtcAiOn.svg";
import WebrtcCallEnd from "../assets/icons/WebrtcCallEnd.svg";
import WebrtcCallStart from "../assets/icons/WebrtcCallStart.svg";
import WebrtcCamOff from "../assets/icons/WebrtcCamOff.svg";
import WebrtcCamOn from "../assets/icons/WebrtcCamOn.svg";
import WebrtcMicOff from "../assets/icons/WebrtcMicOff.svg";
import WebrtcMicOn from "../assets/icons/WebrtcMicOn.svg";
import WebrtcSound from "../assets/icons/WebrtcSound.svg";
import "../styles/WebRtcPage.css";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

type MeUserResponse = {
  id: number;
  email: string;
  name: string;
  coupleStatus?: "SINGLE" | "COUPLED" | string;
  coupleId?: number | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_WS_URL;

const normalizeToken = (raw: string) =>
  raw
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/^Bearer\s+/i, "");

function WebRtcPage() {
  // ====== 상태 ======
  const [room, _setRoom] = useState<Room | undefined>(undefined);
  const roomRef = useRef<Room | undefined>(undefined); // ▶ 정리 시 참조용(클로저 회피)
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>();
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // 메인(풀스크린)으로 보여줄 대상: 로컬/원격 토글
  const [pinned, setPinned] = useState<
    { kind: "local" } | { kind: "remote"; sid: string }
  >({ kind: "local" });

  // UI 토글들
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(50); // 0~100
  const [isAiOn, setIsAiOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const navigate = useNavigate();

  // room state + ref 동기화 함수 (정리 시 ref에서 안전 접근)
  const setAndStoreRoom = (r?: Room) => {
    roomRef.current = r;
    _setRoom(r);
  };

  // ====== 뒤로가기 버튼(좌상단 아이콘) ======
  const onBack = async () => {
    try {
      await leaveRoom(); // ▶ stop → disconnect → state reset
    } finally {
      navigate("/ai");
    }
  };

  // ====== 하단 버튼 액션들(필요 시 확장) ======
  const onSound = () => setIsVolumeVisible((prev) => !prev);
  const onAi = () => setIsAiOn((prev) => !prev);

  // 카메라 on/off (연결을 끊지 않고 화면만 on/off)
  const onCam = () => {
    const r = roomRef.current;
    if (!r) return;
    r.localParticipant.videoTrackPublications.forEach((pub) => {
      if (pub.track) {
        // MediaStreamTrack을 실제로 stop()하지 않고 enabled만 토글
        pub.track.mediaStreamTrack.enabled = !isCamOn;
      }
    });
    setIsCamOn((prev) => !prev);
  };

  // 마이크 on/off
  const onMic = () => {
    const r = roomRef.current;
    if (!r) return;
    r.localParticipant.audioTrackPublications.forEach((pub) => {
      if (pub.track) {
        pub.track.mediaStreamTrack.enabled = !isMicOn;
      }
    });
    setIsMicOn((prev) => !prev);
  };

  // ====== 안전한 정리: 트랙 stop → disconnect ======
  function hardStopLocalMedia(r?: Room) {
    if (!r) return;
    try {
      // 1) 로컬 비디오 트랙 stop (MediaStreamTrack 종료)
      r.localParticipant.videoTrackPublications.forEach((pub) =>
        pub.track?.stop()
      );
      // 2) 로컬 오디오 트랙 stop
      r.localParticipant.audioTrackPublications.forEach((pub) =>
        pub.track?.stop()
      );
      // (필요하면 화면공유 등 데이터 트랙 정리 추가)
    } catch {
      // noop
    }
  }

  async function leaveRoom() {
    const r = roomRef.current;
    if (!r) {
      // 상태 초기화만 해두기
      setAndStoreRoom(undefined);
      setLocalTrack(undefined);
      setRemoteTracks([]);
      return;
    }

    // 1) 로컬 미디어 트랙을 먼저 종료
    hardStopLocalMedia(r);

    // 2) 룸 연결 해제
    try {
      await r.disconnect();
    } catch {
      // noop
    }

    // 3) 상태 초기화
    setAndStoreRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  // ====== 언마운트/뒤로가기/창닫기에서도 반드시 정리 ======
  useEffect(() => {
    // 컴포넌트 언마운트 시
    return () => {
      // 비동기를 기다릴 수 없는 상황이므로 동기 버전
      const r = roomRef.current;
      if (r) {
        try {
          hardStopLocalMedia(r);
          r.disconnect();
        } catch {
          // noop
        } finally {
          roomRef.current = undefined;
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const r = roomRef.current;
      if (!r) return;
      try {
        hardStopLocalMedia(r);
        r.disconnect();
      } catch {
        // noop
      } finally {
        roomRef.current = undefined;
      }
    };

    const handlePopState = () => {
      const r = roomRef.current;
      if (!r) return;
      try {
        hardStopLocalMedia(r);
        r.disconnect();
      } catch {
        // noop
      } finally {
        roomRef.current = undefined;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // ====== 내 정보 조회 → participantName / roomName 세팅 ======
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const raw = localStorage.getItem("accessToken");
        if (!raw) {
          navigate("/auth"); // 로그인 필요
          return;
        }
        const accessToken = normalizeToken(raw);

        const res = await fetch(`${API_BASE}/api/v1/users/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("accessToken");
          navigate("/auth");
          return;
        }
        if (!res.ok) {
          setErrorMsg("내 정보를 불러오지 못했습니다.");
          return;
        }

        const me: MeUserResponse = await res.json();

        if (me.coupleStatus !== "COUPLED" || !me.coupleId) {
          navigate("/connection");
          return;
        }

        setParticipantName(`${me.name}`);
        setRoomName(`couple-${me.coupleId}`);
        setErrorMsg("");
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
          setErrorMsg("내 정보를 불러오는 중 오류가 발생했습니다.");
        }
      }
    })();

    return () => controller.abort();
  }, [navigate]);

  // ====== 방 참가 ======
  async function joinRoom() {
    const r = new Room();
    setAndStoreRoom(r);

    // 원격 트랙 구독 이벤트
    r.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
      setRemoteTracks((prev) => [
        ...prev,
        {
          trackPublication: publication,
          participantIdentity: participant.identity,
        },
      ]);
    });

    // 원격 트랙 해제 이벤트
    r.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteTracks((prev) =>
        prev.filter((t) => t.trackPublication.trackSid !== publication.trackSid)
      );
      // pinned가 해제된 트랙이면 로컬로 전환
      setPinned((cur) => {
        if (cur.kind === "remote" && cur.sid === publication.trackSid) {
          return { kind: "local" };
        }
        return cur;
      });
    });

    try {
      // 토큰 발급
      const token = await getToken(roomName, participantName);
      // 접속
      await r.connect(LIVEKIT_URL, token);
      // 카메라/마이크 퍼블리시
      await r.localParticipant.enableCameraAndMicrophone();

      // 로컬 비디오 트랙 보관
      const vpub = r.localParticipant.videoTrackPublications.values().next()
        .value as RemoteTrackPublication | undefined;
      if (vpub && "videoTrack" in vpub && vpub.videoTrack) {
        setLocalTrack(vpub.videoTrack as LocalVideoTrack);
      }
      // 기본 메인은 로컬
      setPinned({ kind: "local" });
    } catch (error) {
      console.log(
        "There was an error connecting to the room:",
        (error as Error).message
      );
      await leaveRoom();
    }
  }

  // ====== 원격 비디오 썸네일 목록 가공 ======
  const remoteVideoThumbs = useMemo(() => {
    return remoteTracks
      .filter(
        (t) =>
          t.trackPublication.kind === "video" && t.trackPublication.videoTrack
      )
      .map((t) => ({
        sid: t.trackPublication.trackSid,
        identity: t.participantIdentity,
        videoTrack: t.trackPublication.videoTrack!,
      }));
  }, [remoteTracks]);

  const pinnedRemote = useMemo(() => {
    if (pinned.kind !== "remote") return null;
    return remoteVideoThumbs.find((r) => r.sid === pinned.sid) || null;
  }, [pinned, remoteVideoThumbs]);

  const thumbnails = useMemo(() => {
    if (pinned.kind === "remote") {
      const others = remoteVideoThumbs.filter((r) => r.sid !== pinned.sid);
      const localThumb = localTrack
        ? [
            {
              kind: "local" as const,
              key: "local",
              label: participantName,
              onClick: () => setPinned({ kind: "local" }),
            },
          ]
        : [];
      const remoteThumbs = others.map((r) => ({
        kind: "remote" as const,
        key: r.sid,
        label: r.identity,
        onClick: () => setPinned({ kind: "remote", sid: r.sid }),
        track: r.videoTrack,
      }));
      return [...localThumb, ...remoteThumbs];
    } else {
      return remoteVideoThumbs.map((r) => ({
        kind: "remote" as const,
        key: r.sid,
        label: r.identity,
        onClick: () => setPinned({ kind: "remote", sid: r.sid }),
        track: r.videoTrack,
      }));
    }
  }, [pinned, remoteVideoThumbs, localTrack, participantName]);

  // ====== 음량 슬라이더(값만 관리; 실제 적용은 각 오디오 엘리먼트에서 처리 권장) ======
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setVolume(Number(e.target.value));

  // ====== 토큰 발급 ======
  async function getToken(roomName: string, participantName: string) {
    const raw = localStorage.getItem("accessToken");
    if (!raw) throw new Error("로그인이 필요합니다.");
    const accessToken = normalizeToken(raw);

    const res = await fetch(`${API_BASE}/api/v1/calls/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ roomName, participantName }),
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("accessToken");
      throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
    }
    if (!res.ok) {
      let msg = "Failed to get token";
      try {
        const err = await res.json();
        msg = err?.errorMessage || msg;
      } catch {}
      throw new Error(msg);
    }
    const data = await res.json();
    return data.token as string;
  }

  // ====== 렌더링 ======
  return (
    <>
      {!room ? (
        <div id="join">
          <img src={ArrowLeft} id="back-btn" onClick={onBack} />
          <div id="room-info">
            {roomName} / {participantName}
          </div>
          <h2>접속 대기 중..</h2>
          <form
            onSubmit={(e) => {
              joinRoom();
              e.preventDefault();
            }}
          >
            <button
              className="btn webrtc-start"
              type="submit"
              disabled={!roomName || !participantName}
              aria-label="연결하기"
              title="연결하기"
            >
              <img src={WebrtcCallStart} />
            </button>
          </form>
        </div>
      ) : (
        <div id="room">
          {/* 메인(풀스크린) 영역: pinned 에 따라 로컬/원격 표시 */}
          <div className="local-video full-bleed">
            {pinned.kind === "local" && localTrack && (
              <VideoComponent
                track={localTrack}
                participantIdentity={participantName}
                local={true}
              />
            )}
            {pinned.kind === "remote" && pinnedRemote && (
              <VideoComponent
                track={pinnedRemote.videoTrack}
                participantIdentity={pinnedRemote.identity}
                local={false}
              />
            )}
          </div>

          {/* 하단 원격 썸네일 바 */}
          <div className="remote-strip">
            {thumbnails.map((t) =>
              t.kind === "remote" ? (
                <div
                  className="remote-thumb clickable"
                  key={t.key}
                  onClick={t.onClick}
                  title={`${t.label} 보기`}
                >
                  <VideoComponent
                    track={(t as any).track}
                    participantIdentity={t.label}
                  />
                </div>
              ) : (
                <div
                  className="remote-thumb clickable"
                  key={t.key}
                  onClick={t.onClick}
                  title="내 화면 보기"
                >
                  <VideoComponent
                    track={localTrack!}
                    participantIdentity={t.label}
                    local={true}
                  />
                </div>
              )
            )}
          </div>

          {/* 하단 버튼 + 볼륨 팝업 */}
          <div id="room-btn-menu">
            {isVolumeVisible && (
              <div className="volume-popup">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                />
                <span className="volume-label">{volume}</span>
              </div>
            )}
            <img src={WebrtcSound} onClick={onSound} />
            <img
              src={isAiOn ? WebrtcAiOn : WebrtcAiOff}
              onClick={onAi}
              alt="아이 전환"
            />
            <img
              src={isCamOn ? WebrtcCamOn : WebrtcCamOff}
              onClick={onCam}
              alt="카메라 전환"
            />
            <img
              src={isMicOn ? WebrtcMicOn : WebrtcMicOff}
              onClick={onMic}
              alt="마이크 전환"
            />
            <img src={WebrtcCallEnd} onClick={leaveRoom} />
          </div>
        </div>
      )}
    </>
  );
}

export default WebRtcPage;
