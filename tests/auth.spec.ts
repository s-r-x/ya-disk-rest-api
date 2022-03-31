import 'dotenv/config';
import { expect } from 'chai';
import { YaOauth } from '../src';

describe('YaOauth', () => {
  describe('refreshToken', () => {
    it('should update access token by refresh token', async () => {
      const auth = new YaOauth(
        process.env.CLIENT_ID!,
        process.env.CLIENT_SECRET!
      );
      const res = await auth.refreshToken({
        refreshToken: process.env.REFRESH_TOKEN!,
      });
      console.log(res);
      expect(res.access_token).to.be.a('string');
      expect(res.refresh_token).to.be.a('string');
      expect(res.expires_in).to.be.a('number');
    });
  });
});
