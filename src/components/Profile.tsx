import { Scopes } from "@spotify/web-api-ts-sdk";
import { useCallback, useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";
import "../index.css";

function Profile() {
  const { sdk, initialized, reinitialize } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );
  const [hasProfileFetched, setHasProfileFetched] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const user = await sdk?.currentUser.profile();
      setHasProfileFetched(true);
      if (user) {
        localStorage.setItem("user", user.display_name || "");
        setUserName(user.display_name);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [sdk]);

  useEffect(() => {
    if (initialized && sdk && !hasProfileFetched) {
      fetchUserProfile();
    } else if (!initialized && reinitialize) {
      // If initialization failed and reinitialization is requested, reinitialize the SDK
      reinitialize();
    } else {
      // Check if the user's name is already stored in localStorage
      const storedUserName = localStorage.getItem("user");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, [initialized, sdk, fetchUserProfile, reinitialize, hasProfileFetched]);

  return (
    <li>
      <p className="navLink">Hello {userName}!</p>
    </li>
  );
}

export default Profile;
