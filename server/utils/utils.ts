import sha256 from 'crypto-js/sha256';
import fs from 'fs-extra';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

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
    code,
    msg,
    hasError: code > 200
  };
};

export const PASSWORD_SALT = 'mock-platform';

export const generateToken = (uid, passwordSalt = PASSWORD_SALT) => {
  return jwt.sign({ uid }, passwordSalt, { expiresIn: 1 * 60 * 24 * 30 });
};

export const generatePasswod = (password: string, salt = PASSWORD_SALT) => {
  return sha256(password + salt);
};

export const objectIdToString = (id) => {
  return new Types.ObjectId(id).toString();
};
