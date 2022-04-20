import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { IHttpClient, IReqParams, THttpClientRes } from './typings/http';
import { HttpError } from './errors/http';

export class HttpClient implements IHttpClient {
  private _client: AxiosInstance;
  constructor(authToken?: string, baseUrl?: string) {
    const client = axios.create({
      baseURL: baseUrl,
    });
    if (authToken) {
      client.defaults.headers.common.Authorization = authToken;
      client.defaults.maxBodyLength = Infinity;
      client.defaults.maxContentLength = Infinity;
    }
    this._client = client;
  }
  public setAuthToken(token: string) {
    this._client.defaults.headers.common.Authorization = token;
  }
  public async request<T>(params: IReqParams): Promise<THttpClientRes<T>> {
    try {
      const result = await this._client.request({
        url: params.url,
        method: params.method,
        data: params.body,
        params: params.params,
        headers: params.headers,
      });
      return {
        data: result.data,
        headers: result.headers,
      };
    } catch (e) {
      if (!this._isInternalHttpClientError(e)) {
        throw e;
      }
      throw new HttpError({
        originalError: e,
        headers: e.response?.headers ?? {},
        code: e.response?.status,
        message: JSON.stringify(
          e.response?.data ?? e.response?.statusText ?? e.message,
          null,
          2
        ),
      });
    }
  }
  public isHttpError(e: any): e is HttpError {
    return (e as HttpError).isHttpError;
  }
  private _isInternalHttpClientError(e: any): e is AxiosError {
    return (e as AxiosError).isAxiosError;
  }
}
