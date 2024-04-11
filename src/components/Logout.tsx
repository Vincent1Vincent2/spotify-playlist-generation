import { Scopes } from "@spotify/web-api-ts-sdk";
import { useSpotify } from "../hooks/useSpotify";
import "../index.css";

function LogOutButton() {
  const { sdk } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );

  function handleLogout() {
    sdk?.logOut();
    localStorage.clear();
    window.location.reload();
  }

  return (
    <li>
      <button className="logOut navLink" onClick={() => handleLogout()}>
        Log out
      </button>
    </li>
  );
}

export default LogOutButton;
