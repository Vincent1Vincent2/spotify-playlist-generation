// AudioPreview.tsx
import { Track } from "@spotify/web-api-ts-sdk";

interface AudioPreviewProps {
  track: Track;
}

function AudioPreview({ track }: AudioPreviewProps) {
  return (
    <>
      {track.preview_url ? (
        <audio controls>
          <source src={track.preview_url} type="audio/mpeg" />
        </audio>
      ) : (
        <div>No preview available</div>
      )}
    </>
  );
}

export default AudioPreview;
