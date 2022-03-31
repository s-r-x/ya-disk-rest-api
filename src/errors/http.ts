import type { Dict } from '../typings/utils';

export interface IHttpErrorConstructor {
  code?: number;
  headers: Dict<string>;
  originalError: any;
  message: any;
}
export class HttpError extends Error {
  public headers: IHttpErrorConstructor['headers'];
  public code?: IHttpErrorConstructor['code'];
  public originalError: IHttpErrorConstructor['originalError'];
  public isHttpError = true;
  constructor(data: IHttpErrorConstructor) {
    super(data.message);
    this.message = data.message;
    this.name = 'HttpError';
    this.code = data.code;
    this.headers = data.headers;
    this.originalError = data.originalError;
  }
}
