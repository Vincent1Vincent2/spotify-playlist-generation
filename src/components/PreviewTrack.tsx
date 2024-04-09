// AudioPreview.tsx
import { Track } from "@spotify/web-api-ts-sdk";
import "../index.css";

interface AudioPreviewProps {
  track: Track;
}

function AudioPreview({ track }: AudioPreviewProps) {
  return (
    <>
      {track.preview_url ? (
        <audio className="previewController" controls>
          <source src={track.preview_url} type="audio/mpeg" />
        </audio>
      ) : (
        <div>No preview available</div>
      )}
    </>
  );
}

export default AudioPreview;
