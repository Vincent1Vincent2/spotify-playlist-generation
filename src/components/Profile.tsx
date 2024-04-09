import { Scopes, User } from "@spotify/web-api-ts-sdk";
import { useCallback, useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";

function Profile() {
  const { sdk, initialized, reinitialize } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );
  const [profile, setProfile] = useState<User>();
  const [hasProfileFetched, setHasProfileFetched] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const user = await sdk?.currentUser.profile();
      setProfile(user);
      setHasProfileFetched(true);
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
    }
  }, [initialized, sdk, fetchUserProfile, reinitialize, hasProfileFetched]);

  if (!initialized) {
    return <p>Loading...</p>;
  }

  if (!sdk) {
    return <p>Failed to initialize Spotify SDK.</p>;
  }

  if (!profile) {
    return <p>Failed to fetch profile data.</p>;
  }

  return (
    <li>
      <p>Hello {profile.display_name}!</p>
    </li>
  );
}

export default Profile;
