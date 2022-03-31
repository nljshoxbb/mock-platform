import Config from '@/server/config';
import Log from '@/server/utils/Log';
import { connect, connection as db } from 'mongoose';

export default async function connectDatabase(uri: string, user = '', pass = '') {
  db.on('close', () => Log.info('Database connection closed.'));
  const con = await connect(uri, {
    user,
    pass
  });
  Log.info('mongodb 连接成功');

  return con;
}
