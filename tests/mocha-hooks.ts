import { TESTS_DIR } from './constants';
import { createApi } from './utils';

export const mochaHooks = {
  async beforeAll() {
    const api = createApi();
    if (await api.isDirExist(TESTS_DIR)) {
      await api.remove({ path: TESTS_DIR, permanently: true });
    }
    await api.createDir(TESTS_DIR);
  },
};
