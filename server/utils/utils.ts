import { networkInterfaces } from 'os';

import sha256 from 'crypto-js/sha256';
import fs from 'fs-extra';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import config, { isPro } from '../config';

export const fileExist = (filePath: string) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

const instancetMap = new Map();

export const getModelInstance = <T>(M, ...args): T => {
  if (!instancetMap.get(M)) {
    instancetMap.set(M, new M(args));
  }
  return instancetMap.get(M);
};

export const deleteModelInstance = (m) => {
  try {
    instancetMap.delete(m);
  } catch (error) {
    console.error(error);
  }
};

export const responseBody = <T>(data: T, code: number = 200, msg: string = '') => {
  return {
    data,
    status: code,
    msg,
    hasError: code > 200
  };
};

export const PASSWORD_SALT = 'mock-platform';

export const generateToken = (uid, passwordSalt = PASSWORD_SALT) => {
  return jwt.sign({ uid }, passwordSalt, { expiresIn: config.expired });
};

export const generatePasswod = (password: string, salt = PASSWORD_SALT) => {
  return sha256(password + salt).toString();
};

export const objectIdToString = (id): string => {
  return new Types.ObjectId(id).toString();
};

export const getIPAddress = () => {
  if (isPro) {
    return process.env.EXTERNAL_IP;
  }

  const interfaces = networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName] || [];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
};
