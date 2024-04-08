import { Scopes } from "@spotify/web-api-ts-sdk";
import { useSpotify } from "../hooks/useSpotify";

function LogOutButton() {
  const { sdk } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );

  return (
    <li>
      <button className="logOut" onClick={() => sdk?.logOut()}>
        Log out
      </button>
    </li>
  );
}

export default LogOutButton;
