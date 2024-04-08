import { Scopes, User } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";

function Profile() {
  const { sdk, initialized, reinitialize } = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.all
  );
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (initialized && sdk) {
      const fetchUserProfile = async () => {
        try {
          const user = await sdk.currentUser.profile();
          setProfile(user);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    } else if (!initialized && reinitialize) {
      // If initialization failed and reinitialization is requested, reinitialize the SDK
      reinitialize();
    }
  }, [sdk, initialized, reinitialize]);

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
