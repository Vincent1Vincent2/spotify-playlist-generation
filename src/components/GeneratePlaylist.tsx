import {
  AudioFeatures,
  Page,
  Playlist,
  RecommendationsResponse,
  SavedTrack,
  Scopes,
  SpotifyApi,
  Track,
  TrackItem,
} from "@spotify/web-api-ts-sdk";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";

function PlaylistCreator() {
  const sdk = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );

  return sdk ? <PlaylistGeneration sdk={sdk} /> : <></>;
}

function PlaylistGeneration({ sdk }: { sdk: SpotifyApi }) {
  const [user, setUser] = useState<User>();

  const [savedTracks, setSavedTracks] = useState<Page<SavedTrack>>();
  const [trackId, setTrackId] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState<string[]>([]);

  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

  const [recommendationsResponse, setRecommendationsResponse] =
    useState<RecommendationsResponse>();

  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist<TrackItem>>();
  const [trackUris, setTrackUris] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const user = await sdk.currentUser.profile();
      setUser(user);
      const userTracks = await sdk.currentUser.tracks.savedTracks(2, 3, "SE");
      setSavedTracks(userTracks);

      const trackIdArray = userTracks.items.map(
        (trackItem) => trackItem.track.id
      );
      setTrackId(trackIdArray);

      const albumIdArray = userTracks.items.map(
        (trackItem) => trackItem.track.album.id
      );
      setAlbumId(albumIdArray);

      console.log(trackId);
      console.log(albumId);
    })();
  }, [sdk]);

  const request = {
    seed_artists: albumId,
    seed_tracks: trackId,
  };

  useEffect(() => {
    (async () => {
      if (trackId.length > 0) {
        const trackInputs = await sdk.tracks.audioFeatures(
          trackId.map((id) => id.toString())
        );
        const trackData = await sdk.tracks.get(
          trackId.map((id) => id.toString())
        );
        setAudioFeatures(trackInputs);
        setSelectedTracks(trackData);

        const trackRecs = await sdk.recommendations.get(request);
        setRecommendationsResponse(trackRecs);
        const trackUri = trackRecs?.tracks.map((trackItem) => trackItem.uri);
        if (trackUri) {
          setTrackUris(trackUri);
        }
      }
    })();
  }, [trackId]);

  async function createPlaylist() {
    const playlistRequest = {
      name: "Made by jonas",
      public: false,
      description: "A playlist customized by me to you",
    };
    if (user?.id) {
      const createdPlaylist = await sdk.playlists.createPlaylist(
        user.id,
        playlistRequest
      );
      setCreatedPlaylist(createdPlaylist);
      await addTrackToPlaylist(createdPlaylist.id, trackUris);
    }
  }

  async function addTrackToPlaylist(playlistId: string, uris: string[]) {
    if (playlistId) {
      await sdk.playlists.addItemsToPlaylist(playlistId, uris);
    }
  }

  return (
    <>
      <main>
        <div className="playlistContainer">
          {recommendationsResponse?.tracks.map((track) => (
            <div key={track.name} className="trackInfo">
              <p>{track.name}</p>
              <picture>
                <img width={200} src={track.album.images[0].url} alt="" />
              </picture>
            </div>
          ))}
        </div>
        <div className="generateContainer">
          <h2>Time to vibe!</h2>
          <button className="createPlaylistButton" onClick={createPlaylist}>
            Create Playlist
          </button>
        </div>
      </main>
    </>
  );
}

export default PlaylistCreator;
