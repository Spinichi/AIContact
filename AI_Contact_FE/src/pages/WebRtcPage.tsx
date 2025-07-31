import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  createLocalVideoTrack,
  createLocalAudioTrack,
} from "livekit-client";
import { useEffect, useRef, useState, useMemo } from "react";
import VideoComponent from "../components/webrtc/VideoComponent";
import AudioComponent from "../components/webrtc/AudioComponent";
import { useNavigate } from "react-router-dom";
import WebrtcCallStart from "../assets/icons/WebrtcCallStart.svg";
import ArrowLeft from "../assets/icons/ArrowLeft.svg";
import WebrtcAiOff from "../assets/icons/WebrtcAiOff.svg";
import WebrtcAiOn from "../assets/icons/WebrtcAiOn.svg";
import WebrtcCallEnd from "../assets/icons/WebrtcCallEnd.svg";
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

type RemoteVideoInfo = {
  sid: string;
  track: RemoteTrackPublication; // publication 보관
  identity: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_WS_URL;

const normalizeToken = (raw: string) =>
  raw
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/^Bearer\s+/i, "");

function WebRtcPage() {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [pinned, setPinned] = useState<
    { kind: "local" } | { kind: "remote"; sid: string }
  >({ kind: "local" });
  const [isAiOn, setIsAiOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const navigate = useNavigate();

  const onBack = async () => {
    try {
      if (room) {
        await leaveRoom();
      }
    } finally {
      navigate("/ai");
    }
  };

  const onSound = async () => {};
  const onAi = async () => {
    if (!room) return;
    setIsAiOn((prev) => !prev);
  };
  const onCam = async () => {
    if (!room) return;

    const localParticipant = room.localParticipant;

    localParticipant.videoTrackPublications.forEach((pub) => {
      if (pub.track) {
        pub.track.mediaStreamTrack.enabled = !isCamOn;
      }
    });
    setIsCamOn((prev) => !prev);
  };

  const onMic = async () => {
    if (!room) return;

    const localParticipant = room.localParticipant;

    localParticipant.audioTrackPublications.forEach((pub) => {
      if (pub.track) {
        pub.track.mediaStreamTrack.enabled = !isMicOn;
      }
    });
    setIsMicOn((prev) => !prev);
  };

  async function leaveRoom() {
    await room?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  // 1) 내 정보 조회 → participantName/roomName 준비
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

        // 커플 미설정이면 커플 연결 페이지로 안내
        if (me.coupleStatus !== "COUPLED" || !me.coupleId) {
          navigate("/connection");
          return;
        }

        // 준비된 값 세팅(이게 완료된 후 자동 조인 useEffect가 작동)
        setParticipantName(`${me.name}`); // identity는 룸 내 유니크 권장
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

  async function joinRoom() {
    const room = new Room();
    setRoom(room);

    // 새 트랙 생성시마다
    room.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
      setRemoteTracks((prev) => [
        ...prev,
        {
          trackPublication: publication,
          participantIdentity: participant.identity,
        },
      ]);
    });

    // 트랙 소멸시마다
    room.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteTracks((prev) =>
        prev.filter((t) => t.trackPublication.trackSid !== publication.trackSid)
      );
      // 만약 현재 pinned 가 언서브된 원격 트랙이었다면 로컬로 전환
      setPinned((cur) => {
        if (cur.kind === "remote" && cur.sid === publication.trackSid) {
          return { kind: "local" };
        }
        return cur;
      });
    });

    try {
      const token = await getToken(roomName, participantName);
      await room.connect(LIVEKIT_URL, token);
      await room.localParticipant.enableCameraAndMicrophone();

      const pubIter = room.localParticipant.videoTrackPublications
        .values()
        .next();
      const vpub = pubIter.value;
      if (vpub?.videoTrack) {
        setLocalTrack(vpub.videoTrack);
        // 기본 pinned 는 로컬
        setPinned({ kind: "local" });
      }
    } catch (error) {
      console.log(
        "There was an error connecting to the room:",
        (error as Error).message
      );
      await leaveRoom();
    }
  }

  // 썸네일 렌더링에 필요한 "원격 비디오"만 추리기
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

  // 현재 pinned 가 remote 일 때 해당 트랙 찾기
  const pinnedRemote = useMemo(() => {
    if (pinned.kind !== "remote") return null;
    return remoteVideoThumbs.find((r) => r.sid === pinned.sid) || null;
  }, [pinned, remoteVideoThumbs]);

  // 썸네일 목록 구성:
  // - pinned 가 remote 이면: 로컬(있으면) + 다른 원격들(= pinned 제외)
  // - pinned 가 local 이면: 모든 원격들
  const thumbnails = useMemo(() => {
    if (pinned.kind === "remote") {
      const others = remoteVideoThumbs.filter((r) => r.sid !== pinned.sid);
      // 로컬 썸네일(있으면)
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
      // pinned == local
      return remoteVideoThumbs.map((r) => ({
        kind: "remote" as const,
        key: r.sid,
        label: r.identity,
        onClick: () => setPinned({ kind: "remote", sid: r.sid }),
        track: r.videoTrack,
      }));
    }
  }, [pinned, remoteVideoThumbs, localTrack, participantName]);

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
          {/* 메인(풀스크린) 영역: pinned 에 따라 로컬/원격을 메인으로 */}
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

          {/* 썸네일 바: pinned 제외/포함 로직대로 */}
          <div className="remote-strip">
            {thumbnails.map((t) =>
              t.kind === "remote" ? (
                <div
                  className="remote-thumb clickable"
                  key={t.key}
                  onClick={t.onClick}
                  title={`${t.label} 보기`}
                >
                  {/* 원격 썸네일 */}
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
                  {/* 로컬 썸네일: 로컬 track 재사용 */}
                  <VideoComponent
                    track={localTrack!}
                    participantIdentity={t.label}
                    local={true}
                  />
                </div>
              )
            )}
          </div>

          {/* 하단 버튼 */}
          <div id="room-btn-menu">
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
