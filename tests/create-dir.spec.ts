import { expect } from 'chai';
import { TESTS_DIR } from './constants';
import { createApi } from './utils';

describe('createDir', () => {
  it('should create a new directory', async () => {
    const path = TESTS_DIR + '/ololo';
    const ya = createApi();
    const res = await ya.createDir(path);
    expect(res.href).to.be.string;
  });
});
