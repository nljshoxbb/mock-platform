import fs from 'fs-extra';

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
