import { expect } from 'chai';
import { createReadStream } from 'fs';
import { createApi, createRandomName } from './utils';
import { TEST_BINARY_FILE } from './constants';

describe('upload', () => {
  it('should upload when file param is a filepath', async () => {
    const api = createApi();
    let error: any;
    try {
      await api.upload({
        path: createRandomName() + '.txt',
        overwrite: true,
        file: TEST_BINARY_FILE,
      });
    } catch (e) {
      console.error(e);
      error = e;
    }
    expect(error).to.be.undefined;
  });
  it('should upload when file param is a stream', async () => {
    const api = createApi();
    let error: any;
    try {
      const stream = createReadStream(TEST_BINARY_FILE, 'binary');
      await api.upload({
        file: stream,
        path: createRandomName() + '.txt',
        overwrite: true,
      });
    } catch (e) {
      console.error(e);
      error = e;
    }
    expect(error).to.be.undefined;
  });
  it('should upload when file param is a buffer', async () => {
    const api = createApi();
    let error: any;
    try {
      const buff = Buffer.from('hello world', 'utf-8');
      await api.upload({
        path: createRandomName() + '.txt',
        overwrite: true,
        file: buff,
      });
    } catch (e) {
      console.error(e);
      error = e;
    }
    expect(error).to.be.undefined;
  });
});
