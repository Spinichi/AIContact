import { RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

interface AudioComponentProps {
  track: RemoteAudioTrack;
  volume: number; // 0 ~ 100
  muted: boolean;
}

function AudioComponent({ track, volume }: AudioComponentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      track.attach(audioRef.current);
      // attach 직후 재생 시도를 하는데 autoplay에 막히면 catch로 확인해보기
      audioRef.current.play?.().catch(err => console.warn("audio.play() blocked:", err));
    }

    return () => {
      track.detach();

      if (audioRef.current) track.detach(audioRef.current);
    };
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current != null) {
      audioRef.current.muted = !!(arguments as any)[0]?.muted;
    }
  }, [(arguments as any)[0]?.muted]);

  return <audio ref={audioRef} autoPlay playsInline/>;
}

export default AudioComponent;
