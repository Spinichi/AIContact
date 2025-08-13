import {
  LocalVideoTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import type { RemoteAudioTrack } from "livekit-client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersApi } from "../apis/user";
import { WebRtcApi } from "../apis/webrtc";
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
import VideoComponent from "../components/webrtc/VideoComponent";
import "../styles/WebRtcPage.css";
import { normalizeToken } from "../utils/token";
import AudioComponent from "../components/webrtc/AudioComponent";


const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_WS_URL;

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

function WebRtcPage() {
  const [room, _setRoom] = useState<Room | undefined>(undefined);
  const roomRef = useRef<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>();
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [pinned, setPinned] = useState<
    { kind: "local" } | { kind: "remote"; sid: string }
  >({ kind: "local" });
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isAiOn, setIsAiOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const navigate = useNavigate();

  const setAndStoreRoom = (r?: Room) => {
    roomRef.current = r;
    _setRoom(r);
  };

  const onBack = async () => {
    try {
      await leaveRoom();
    } finally {
      navigate("/ai");
    }
  };

  const onSound = () => setIsVolumeVisible((prev) => !prev);
  const onAi = () => setIsAiOn((prev) => !prev);
  const onCam = () => {
    const r = roomRef.current;
    if (!r) return;
    r.localParticipant.videoTrackPublications.forEach((pub) => {
      if (pub.track) pub.track.mediaStreamTrack.enabled = !isCamOn;
    });
    setIsCamOn((prev) => !prev);
  };
  const onMic = () => {
    const r = roomRef.current;
    if (!r) return;
    r.localParticipant.audioTrackPublications.forEach((pub) => {
      if (pub.track) pub.track.mediaStreamTrack.enabled = !isMicOn;
    });
    setIsMicOn((prev) => !prev);
  };

  function hardStopLocalMedia(r?: Room) {
    if (!r) return;
    try {
      r.localParticipant.videoTrackPublications.forEach((pub) =>
        pub.track?.stop()
      );
      r.localParticipant.audioTrackPublications.forEach((pub) =>
        pub.track?.stop()
      );
    } catch { }
  }

  async function leaveRoom() {
    const r = roomRef.current;
    if (!r) {
      setAndStoreRoom(undefined);
      setLocalTrack(undefined);
      setRemoteTracks([]);
      return;
    }
    hardStopLocalMedia(r);
    try {
      await r.disconnect();
    } catch { }
    setAndStoreRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  useEffect(() => {
    return () => {
      const r = roomRef.current;
      if (r) {
        try {
          hardStopLocalMedia(r);
          r.disconnect();
        } catch {
        } finally {
          roomRef.current = undefined;
        }
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const raw = localStorage.getItem("accessToken");
        if (!raw) return navigate("/auth");
        const accessToken = normalizeToken(raw);
        const res = await UsersApi.getMe({
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });
        const me = res.data;
        if (me.coupleStatus !== "COUPLED" || !me.coupleId)
          return navigate("/connection");
        setParticipantName(me.name);
        setRoomName(`couple-${me.coupleId}`);
      } catch (e: any) {
        if (e.name !== "AbortError")
          alert("내 정보를 불러오는 중 오류가 발생했습니다.");
      }
    })();
    return () => controller.abort();
  }, [navigate]);

  async function joinRoom() {
    const r = new Room();
    setAndStoreRoom(r);

    r.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
      setRemoteTracks((prev) => [
        ...prev,
        {
          trackPublication: publication,
          participantIdentity: participant.identity,
        },
      ]);
    });
    r.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteTracks((prev) =>
        prev.filter((t) => t.trackPublication.trackSid !== publication.trackSid)
      );
      setPinned((cur) =>
        cur.kind === "remote" && cur.sid === publication.trackSid
          ? { kind: "local" }
          : cur
      );
    });
    try {
      const accessToken = normalizeToken(
        localStorage.getItem("accessToken") || ""
      );
      const res = await WebRtcApi.getToken(
        { roomName, participantName },
        accessToken
      );
      const token = res.data.token;
      await r.connect(LIVEKIT_URL, token);

      try {
        await r.startAudio();
      } catch (e) {
        console.warn("startAudio failed (autoplay policy):", e);
      }

      await r.localParticipant.enableCameraAndMicrophone();
      const vpub = r.localParticipant.videoTrackPublications
        .values()
        .next().value;
      if (vpub && vpub.videoTrack) setLocalTrack(vpub.videoTrack);
      setPinned({ kind: "local" });
    } catch (error) {
      console.error("연결 오류:", error);
      await leaveRoom();
    }
  }

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setVolume(Number(e.target.value));

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
          <div className="remote-strip">
            {thumbnails.map((t) => (
              <div
                className="remote-thumb clickable"
                key={t.key}
                onClick={t.onClick}
                title={t.kind === "remote" ? `${t.label} 보기` : "내 화면 보기"}
              >
                <VideoComponent
                  track={(t as any).track ?? localTrack!}
                  participantIdentity={t.label}
                  local={t.kind === "local"}
                />
              </div>
            ))}
          </div>
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
            <img src={isAiOn ? WebrtcAiOn : WebrtcAiOff} onClick={onAi} />
            <img src={isCamOn ? WebrtcCamOn : WebrtcCamOff} onClick={onCam} />
            <img src={isMicOn ? WebrtcMicOn : WebrtcMicOff} onClick={onMic} />
            <img src={WebrtcCallEnd} onClick={leaveRoom} />
          </div>
          <div style={{ display: "none" }}>
            {remoteTracks
              .map((t) => t.trackPublication)
              .filter((pub) => pub.kind === "audio" && !!pub.track)
              .map((pub) => (
                <AudioComponent
                  key={pub.trackSid}
                  track={pub.track as RemoteAudioTrack}
                  volume={volume}
                  muted={false}
                />
              ))}
          </div>

        </div>
      )}
    </>
  );
}

export default WebRtcPage;
