import { expect } from 'chai';
import { createApi, createRandomName } from './utils';

describe('createDir', () => {
  it('should create a new directory', async () => {
    const path = createRandomName();
    const ya = createApi();
    const res = await ya.createDir(path);
    expect(res.href).to.be.string;
  });
});
