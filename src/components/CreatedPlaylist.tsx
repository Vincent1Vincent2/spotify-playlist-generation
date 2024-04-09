// PlaylistCreated.tsx
import { Playlist, Scopes, TrackItem } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSpotify } from "../hooks/useSpotify";

function CreatedPlayList() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { sdk, initialized } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );
  const [createdPlaylist, setCreatedPlaylist] =
    useState<Playlist<TrackItem> | null>(null);

  useEffect(() => {
    if (initialized && sdk && playlistId) {
      (async () => {
        const playlist = await sdk.playlists.getPlaylist(playlistId);
        setCreatedPlaylist(playlist);
      })();
    }
  }, [initialized, sdk, playlistId]);

  if (!initialized || !sdk || !createdPlaylist) {
    return <p>Loading...</p>;
  }

  return (
    <div className="createdPlaylist">
      <h1>Your Playlist is Ready!</h1>
      <div>
        <img src={createdPlaylist.images[0].url} alt={createdPlaylist.name} />
        <h2>{createdPlaylist.name}</h2>
        <p>{createdPlaylist.description}</p>
        <a
          href={createdPlaylist.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
        >
          Open Playlist on Spotify
        </a>
      </div>
    </div>
  );
}

export default CreatedPlayList;
