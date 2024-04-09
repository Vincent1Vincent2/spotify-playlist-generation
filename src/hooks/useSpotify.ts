import {
  AuthorizationCodeWithPKCEStrategy,
  Scopes,
  SdkOptions,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useRef, useState } from "react";
import LocalStorageCachingStrategy from "../utils/cachingStratergy";

export function useSpotify(
  clientId: "d4dc4ed96a9747cc95da42119237298b",
  redirectUrl: "https://spotify-playlist-generation.vercel.app/auth",
  scopes: string[],
  config?: SdkOptions
) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { current: activeScopes } = useRef(scopes);

  useEffect(() => {
    const cachingStrategy = new LocalStorageCachingStrategy();
    const auth = new AuthorizationCodeWithPKCEStrategy(
      "d4dc4ed96a9747cc95da42119237298b",
      "https://spotify-playlist-generation.vercel.app/auth",
      Scopes.all
    );

    const internalSdk = new SpotifyApi(auth, {
      ...config,

      cachingStrategy,
    });
    console.log(activeScopes);
    const initializeSdk = async () => {
      try {
        const { authenticated } = await internalSdk.authenticate();
        if (authenticated) {
          setSdk(internalSdk);
          setInitialized(true);
        } else {
          console.error("Authentication failed.");
        }
      } catch (error) {
        console.error("Failed to initialize Spotify SDK:", error);
      }
    };

    initializeSdk();

    return () => {};
  }, [clientId, redirectUrl, config]);

  const reinitialize = () => {
    setInitialized(false);
  };

  return { sdk, initialized, reinitialize };
}
