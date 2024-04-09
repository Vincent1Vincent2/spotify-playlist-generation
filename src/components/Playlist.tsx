import { Track } from "@spotify/web-api-ts-sdk";
import "../index.css";
import PreviewAudioPlayer from "./PreviewTrack";

interface PlaylistDisplayProps {
  tracks: Track[];
}

function PlaylistDisplay({ tracks }: PlaylistDisplayProps) {
  return (
    <div className="playlistContainer">
      {tracks.map((track) => (
        <div key={track.name} className="trackInfo">
          <p className="trackName">{track.name}</p>

          <picture>
            <img width={300} src={track.album.images[0].url} alt={track.name} />
          </picture>
          {track.preview_url ? (
            <PreviewAudioPlayer src={track.preview_url} />
          ) : (
            <div className="noPreview">No preview available</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PlaylistDisplay;
