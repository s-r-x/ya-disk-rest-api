export interface IRefreshTokenParams {
  refreshToken: string;
}
export interface IRefreshTokenRes {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
}
