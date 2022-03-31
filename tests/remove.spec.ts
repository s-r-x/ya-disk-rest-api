import { expect } from 'chai';
import { TEST_BINARY_FILE } from './constants';
import { createApi, createRandomName } from './utils';

describe('remove', () => {
  it('should remove a directory', async () => {
    const ya = createApi();
    const path = createRandomName();
    await ya.createDir(path);
    await ya.remove({
      path,
      permanently: true,
    });
    expect(await ya.isDirExist(path)).to.be.false;
  });
  it('should remove a file', async () => {
    const ya = createApi();
    const path = createRandomName();
    await ya.upload({
      path,
      file: TEST_BINARY_FILE,
    });
    await ya.remove({
      path,
      permanently: true,
    });
    expect(await ya.isFileExist(path)).to.be.false;
  });
});
