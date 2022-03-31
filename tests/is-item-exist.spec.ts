import { expect } from 'chai';
import { TEST_BINARY_FILE } from './constants';
import { createApi, createRandomName } from './utils';

describe('itItemExist', () => {
  it('should work without type', async () => {
    const ya = createApi();
    const path = createRandomName();
    expect(await ya.isItemExist({ path })).to.be.false;
    await ya.upload({ path, file: TEST_BINARY_FILE });
    expect(await ya.isItemExist({ path })).to.be.true;
  });
  it('should work with directories', async () => {
    const ya = createApi();
    const path = createRandomName();
    await ya.createDir(path);
    expect(await ya.isItemExist({ path, type: 'file' })).to.be.false;
    expect(await ya.isItemExist({ path, type: 'dir' })).to.be.true;
  });
  it('should work with files', async () => {
    const ya = createApi();
    const path = createRandomName();
    await ya.upload({ path, file: TEST_BINARY_FILE });
    expect(await ya.isItemExist({ path, type: 'file' })).to.be.true;
    expect(await ya.isItemExist({ path, type: 'dir' })).to.be.false;
  });
});
