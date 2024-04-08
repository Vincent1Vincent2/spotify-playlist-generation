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
  const { current: activeScopes } = useRef(scopes);

  useEffect(() => {
    (async () => {
      const cachingStrategy = new LocalStorageCachingStrategy();
      const auth = new AuthorizationCodeWithPKCEStrategy(
        clientId,
        redirectUrl,
        Scopes.all
      );
      const internalSdk = new SpotifyApi(auth, { ...config, cachingStrategy });

      try {
        // Check if the URL contains an authorization code
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");

        if (code) {
          // Exchange the authorization code for an access token
          const accessToken = await auth.getOrCreateAccessToken();
          // Store the access token and do something with it
          console.log("Access token:", accessToken);
        } else {
          // Authenticate the user
          const { authenticated } = await internalSdk.authenticate();

          if (authenticated) {
            setSdk(() => internalSdk);
          }
        }
      } catch (e: Error | unknown) {
        const error = e as Error;
        if (
          error &&
          error.message &&
          error.message.includes("No verifier found in cache")
        ) {
          console.error(
            "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
            error
          );
        } else {
          console.error(e);
        }
      }
    })();
  }, [clientId, redirectUrl, config, activeScopes, location.search, history]);

  return sdk;
}
