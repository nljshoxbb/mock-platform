import Log from '@/server/utils/Log';
import { connect, connection as db } from 'mongoose';

export default async function connectDatabase(uri: string) {
  db.on('close', () => Log.info('Database connection closed.'));
  const con = await connect(uri);
  Log.info('mongodb θΏζ₯ζε');

  return con;
}
