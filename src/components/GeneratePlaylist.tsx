import {
  AudioFeatures,
  Page,
  Playlist,
  RecommendationsResponse,
  SavedTrack,
  Scopes,
  Track,
  TrackItem,
  User,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotify } from "../hooks/useSpotify";
import "../index.css";
import PlaylistDisplay from "./Playlist";

function PlaylistCreator() {
  const { sdk, initialized } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );

  const [user, setUser] = useState<User | null>(null);
  const [savedTracks, setSavedTracks] = useState<Page<SavedTrack> | null>(null);
  const [trackId, setTrackId] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState<string[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [recommendationsResponse, setRecommendationsResponse] =
    useState<RecommendationsResponse | null>(null);
  const [createdPlaylists, setCreatedPlaylist] =
    useState<Playlist<TrackItem> | null>(null);
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && sdk) {
      (async () => {
        const currentUser = await sdk.currentUser.profile();
        setUser(currentUser);
        const userTracks = await sdk.currentUser.tracks.savedTracks(2, 3, "SE");
        setSavedTracks(userTracks);
        console.log(savedTracks);

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
    }
  }, [initialized, sdk]);

  const request = {
    seed_artists: albumId,
    seed_tracks: trackId,
  };

  useEffect(() => {
    if (initialized && sdk && trackId.length > 0) {
      (async () => {
        const trackInputs = await sdk.tracks.audioFeatures(
          trackId.map((id) => id.toString())
        );
        const trackData = await sdk.tracks.get(
          trackId.map((id) => id.toString())
        );
        setAudioFeatures(trackInputs);
        setSelectedTracks(trackData);
        console.log(audioFeatures);
        console.log(selectedTracks);

        const trackRecs = await sdk.recommendations.get(request);
        setRecommendationsResponse(trackRecs);
        const trackUri = trackRecs?.tracks.map((trackItem) => trackItem.uri);
        if (trackUri) {
          setTrackUris(trackUri);
        }
      })();
    }
  }, [initialized, sdk, trackId]);

  async function createPlaylist() {
    if (user?.id && sdk && trackUris.length > 0) {
      const playlistRequest = {
        name: "Made by jonas",
        public: false,
        description: "A playlist customized by me to you",
      };

      const createdPlaylist = await sdk.playlists.createPlaylist(
        user.id,
        playlistRequest
      );
      setCreatedPlaylist(createdPlaylist);
      console.log(createdPlaylists);

      await addTrackToPlaylist(createdPlaylist.id, trackUris);
      navigate(`/playlist/${createdPlaylist.id}`);
    }
  }

  async function addTrackToPlaylist(playlistId: string, uris: string[]) {
    if (sdk && playlistId) {
      await sdk.playlists.addItemsToPlaylist(playlistId, uris);
    }
  }

  function newTracks() {
    location.reload();
  }

  if (!initialized || !sdk) {
    location.reload();
  }

  return (
    <main>
      <PlaylistDisplay tracks={recommendationsResponse?.tracks || []} />
      <div className="generateContainer">
        <h2>Time to vibe!</h2>

        <div className="buttonContainer">
          <button className="createPlaylistButton" onClick={createPlaylist}>
            Create Playlist
          </button>
          <p className="or">or</p>

          <button className="createPlaylistButton" onClick={newTracks}>
            Request new playlist
          </button>
        </div>
      </div>
    </main>
  );
}

export default PlaylistCreator;
