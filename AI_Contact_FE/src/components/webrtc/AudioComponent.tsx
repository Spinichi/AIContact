// AudioComponent.tsx
import { useEffect, useRef } from "react";
import { RemoteAudioTrack } from "livekit-client";

interface AudioComponentProps {
  track: RemoteAudioTrack;
  volume: number; // 0 ~ 100
}

function AudioComponent({ track, volume }: AudioComponentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      track.attach(audioRef.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return <audio ref={audioRef} autoPlay />;
}

export default AudioComponent;
