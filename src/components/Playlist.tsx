import { Track } from "@spotify/web-api-ts-sdk";
import AudioPreview from "./PreviewTrack";

interface PlaylistDisplayProps {
  tracks: Track[];
}

function PlaylistDisplay({ tracks }: PlaylistDisplayProps) {
  return (
    <div className="playlistContainer">
      {tracks.map((track) => (
        <div key={track.name} className="trackInfo">
          <p>{track.name}</p>
          <AudioPreview track={track} />
          <picture>
            <img width={200} src={track.album.images[0].url} alt="" />
          </picture>
        </div>
      ))}
    </div>
  );
}

export default PlaylistDisplay;
