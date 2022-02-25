import Log from '@/server/utils/Log';
import { connect, connection as db } from 'mongoose';
import AutoIncrement from 'mongoose-auto-increment';

export default async function connectDatabase(uri: string) {
  db.on('close', () => Log.info('Database connection closed.'));
  const con = await connect(uri);
  Log.info('mongodb 连接成功');
  AutoIncrement.initialize(con.connection);

  return con;
}
