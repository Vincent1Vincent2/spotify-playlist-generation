import type {
  AccessToken,
  IAuthStrategy,
  ICachingStrategy,
  SdkConfiguration,
} from "@spotify/web-api-ts-sdk";

export default class AuthorizationCodeWithPKCEStrategy
  implements IAuthStrategy
{
  protected clientId: "d4dc4ed96a9747cc95da42119237298b";
  protected redirectUri: "https://spotify-playlist-generation.vercel.app/";
  protected scopes: string[];
  private static readonly cacheKey;
  private configuration;
  protected get cache(): ICachingStrategy;
  constructor(clientId: string, redirectUri: string, scopes: string[]);
  setConfiguration(configuration: SdkConfiguration): void;
  getOrCreateAccessToken(): Promise<AccessToken>;
  getAccessToken(): Promise<AccessToken | null>;
  removeAccessToken(): void;
  private redirectOrVerifyToken;
  private redirectToSpotify;
  private verifyAndExchangeCode;
  private removeCodeFromUrl;
  protected generateRedirectUrlForUser(
    scopes: string[],
    challenge: string
  ): Promise<string>;
  protected exchangeCodeForToken(
    code: string,
    verifier: string
  ): Promise<AccessToken>;
}
