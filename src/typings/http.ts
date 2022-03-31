import type { Method } from 'axios';
import type { Dict } from './utils';

export type THeaders = Dict<string>;

interface IOkHttpClientRes<T> {
  data: T;
  headers: THeaders;
}

export type THttpClientRes<T> = IOkHttpClientRes<T>;
export interface IReqParams {
  url?: string;
  body?: any;
  params?: Dict<any>;
  method: Method;
  headers?: THeaders;
}
export interface IHttpClient {
  request<T>(params: IReqParams): Promise<THttpClientRes<T>>;
}
