import { expect } from 'chai';
import { createApi } from './utils';

describe('getUploadUrl', () => {
  it('should return an url for uploading', async () => {
    const api = createApi();
    const res = await api.getUploadUrl({
      path: 'my-file.txt',
      overwrite: true,
    });
    expect(res.href).to.be.string;
    expect(res.operation_id).to.be.string;
  });
});
