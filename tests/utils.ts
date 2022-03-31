import 'dotenv/config';
import { YaDisk } from '../src';
import crypto from 'crypto';
import { TESTS_DIR } from './constants';

export const createApi = () => new YaDisk(process.env.ACCESS_TOKEN!);

export const createRandomName = (length = 10): string =>
  TESTS_DIR + '/' + crypto.randomBytes(length).toString('hex');
