import { YA_OAUTH_BASE_URL } from './config';
import { HttpClient } from './http-client';
import { URLSearchParams } from 'url';
import type {
  IRefreshTokenParams,
  IRefreshTokenRes,
} from './typings/yandex-auth';

export class YaOauth {
  private _httpClient: HttpClient;
  constructor(private _clientId: string, private _clientSecret: string) {
    this._httpClient = new HttpClient(undefined, YA_OAUTH_BASE_URL);
  }

  public get clientSecret(): string {
    return this._clientSecret;
  }
  public set clientSecret(clientSecret: string) {
    this._clientSecret = clientSecret;
  }
  public get clientId(): string {
    return this._clientId;
  }
  public set clientId(clientId) {
    this._clientId = clientId;
  }

  /**
   * Обновить access токен используя refresh токен
   */
  public async refreshToken(
    params: IRefreshTokenParams
  ): Promise<IRefreshTokenRes> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: params.refreshToken,
    });
    const res = await this._httpClient.request<IRefreshTokenRes>({
      url: '/token',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    return res.data;
  }
}
