import {
  AuthorizationCodeWithPKCEStrategy,
  LocalStorageCachingStrategy,
  Scopes,
  SdkOptions,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useRef, useState } from "react";

export function useSpotify(
  clientId: string,
  redirectUrl: string,
  scopes: string[],
  config?: SdkOptions
) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { current: activeScopes } = useRef(scopes);

  useEffect(() => {
    const cachingStrategy = new LocalStorageCachingStrategy();
    const auth = new AuthorizationCodeWithPKCEStrategy(
      clientId,
      redirectUrl,
      Scopes.all
    );
    const internalSdk = new SpotifyApi(auth, { ...config, cachingStrategy });

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
