// CustomAudioPlayer.tsx
import { useRef, useState } from "react";

interface CustomAudioPlayerProps {
  src: string;
}

function PreviewAudioPlayer({ src }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="audioPlayer">
      <button className="audioPlayButton" onClick={handlePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
    </div>
  );
}

export default PreviewAudioPlayer;
