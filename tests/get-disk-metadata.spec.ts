import { expect } from 'chai';
import { createApi } from './utils';

describe('getDiskMetadata', () => {
  it('should return correct metadata', async () => {
    const ya = createApi();
    const metadata = await ya.getDiskMetadata();
    expect(metadata.max_file_size).to.be.a('number');
    expect(metadata.unlimited_autoupload_enabled).to.be.a('boolean');
    expect(metadata.total_space).to.be.a('number');
    expect(metadata.trash_size).to.be.a('number');
    expect(metadata.used_space).to.be.a('number');
    expect(metadata.is_paid).to.be.a('boolean');
    expect(metadata.system_folders).to.be.an('object');
    expect(Object.values(metadata.system_folders)[0]).to.be.a('string');
    expect(metadata.revision).to.be.a('number');
    const user = metadata.user;
    expect(user).to.be.an('object');
    expect(user.country).to.be.a('string');
    expect(user.login).to.be.a('string');
    expect(user.display_name).to.be.a('string');
    expect(user.uid).to.be.a('string');
  });
});
