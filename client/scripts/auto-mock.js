const fs = require('fs');

const { exec } = require('child_process');

const config = require('./config.js');

const path = require('path');

const mockPath = path.join(process.cwd(), config.mockPath);

const YAML = require('yamljs');

const axios = require('axios');

const mockConfig = require('./config.mock.js');

let content = `/**
 *
 *
 */
const Mock = require('mockjs');
`;

const capital = (word) => word.replace(/^\S/, (s) => s.toUpperCase());

const getSchemas = (schema) => {
  if (schema.$ref) {
    return schema.$ref.split('#/components/schemas/')[1];
  }
  return {};
};

const getSchemasName = (data, config = {}) => {
  const { status = '200', type = 'application/json' } = config;
  try {
    return getSchemas(data.responses[status].content[type].schema);
  } catch (error) {
    return {};
  }
};

const handleType = (type) => {
  let result;
  switch (type) {
    case 'array':
      result = [];
      break;
    case 'string':
      result = `@string("lower", 20)`;
      break;
    case 'integer':
      result = '@increment';
      break;
    case 'boolean':
      result = '@boolean';
      break;
    default:
      break;
  }
  return result;
};

const matchField = (field) => {
  return mockConfig[field];
};

const getRangeConfig = (str) => {
  return str.split('|');
};

/**
 *
 * @param {*} desc
 * @param {*} fieldPath
 * @returns
 */
const generateDesc = (desc, fieldPath) => {
  return `
  /**
  * ${desc || '缺少字段说明'}
  * 配置路径： ${fieldPath}
  * */
 `;
};

const generateField = (schemasName = '', schemaObject = {}, parentPath = '') => {
  if (schemaObject[schemasName] && schemaObject[schemasName].properties) {
    const { properties, type } = schemaObject[schemasName];
    let result = '';
    for (const [key, value] of Object.entries(properties)) {
      /** 字段路径，以response schema起头 */
      const fieldPath = parentPath ? `${parentPath}.${key}` : `${schemasName}.${key}`;
      const configData = matchField(fieldPath);

      if (type === 'object') {
        const desc = generateDesc(value.description, fieldPath);

        if (value.$ref) {
          const name = getSchemas(value);
          const schema = generateField(name, schemaObject, fieldPath);
          result += `${desc} '${key}':${configData || schema},`;
        }

        if (value.type === 'array') {
          if (value.items.$ref) {
            const name = getSchemas(value.items);
            const schema = generateField(name, schemaObject, fieldPath);

            /** 是否配置数组长度 */
            const arr = Object.keys(mockConfig).filter((i) => {
              const [fieldNamePath, range] = getRangeConfig(i);
              return range && fieldNamePath === fieldPath;
            });

            const configItem = arr[0];

            if (configItem) {
              const [fieldNamePath, range] = getRangeConfig(configItem);
              if (fieldNamePath === fieldPath) {
                result += `${desc} '${key}|${range}': [${mockConfig[configItem]}],`;
              }
            } else {
              if (configData) {
                result += `${desc} '${key}': ${configData},`;
              } else {
                result += `${desc} '${key}|10': [${schema}],`;
              }
            }
          } else {
            if (value.items.type === 'string') {
              /** 处理非对象字段 */
              result += `${desc} '${key}|1-5': ['${configData || handleType(value.items.type)}'],`;
            }
          }
        }

        if (['string', 'integer', 'boolean'].includes(value.type)) {
          /** 处理非对象字段 */
          result += `${desc} ${key}: '${configData || handleType(value.type)}',`;
        }
      }
    }

    if (type === 'object') {
      return `{${result}}`;
    } else if (type === 'array') {
      return `[${result}],`;
    }
    return result;
  }
};

const handleRequest = (method, data, schemaObject) => {
  if (method === 'get') {
    const parameters = data.parameters || null;
    // query
  } else if (method === 'post') {
    try {
      const requestBodyContent = data.requestBody ? data.requestBody.content : null;
      const ContentType = requestBodyContent && Object.keys(requestBodyContent)[0];
      const schemasName = getSchemasName(data);
      return generateField(schemasName, schemaObject);
    } catch (error) {
      console.log(error);
      return {};
    }

    // body
  }
};

/**
 *
 * @param {*} method
 * @param {*} data
 * @param {*} schemaObject
 * @returns
 */
const handleResponse = (method, data, schemaObject) => {
  if (method === 'get') {
    const parameters = data.parameters || null;
    // query
    try {
      const schemasName = getSchemasName(data, '200');
      return generateField(schemasName, schemaObject, '');
    } catch (error) {
      console.log(error);
      return {};
    }
  } else if (method === 'post') {
    try {
      const requestBodyContent = data.requestBody ? data.requestBody.content : null;
      const ContentType = requestBodyContent && Object.keys(requestBodyContent)[0];
      const schemasName = getSchemasName(data, '200');
      return generateField(schemasName, schemaObject, '');
    } catch (error) {
      console.log(error);
      return {};
    }

    // body
  }
};

const generateMock = () => {
  axios
    .request({ url: config.docUrl, method: 'get' })
    .then(({ data }) => {
      const nativeObject = YAML.parse(data);
      let mainContent = '';
      for (const [key, value] of Object.entries(nativeObject.paths)) {
        const methods = Object.keys(value)[0];
        const requestBodyContent = value[methods].requestBody ? value[methods].requestBody.content : null;
        const parameters = value[methods].parameters || null;
        const apiDesc = value[methods].description;
        const ContentType = requestBodyContent && Object.keys(requestBodyContent)[0];
        const names = key.split('/');
        const lastName = capital(names[names.length - 1]);
        const lastSecondName = capital(names[names.length - 2]);
        const __name = lastSecondName + lastName;
        const requestBody = requestBodyContent ? `data: ${__name}Request,` : '';
        const dataConfig = requestBodyContent ? 'data,' : '';
        const requestParams = parameters ? `params: ${__name}Params,` : '';
        const paramsConfig = parameters ? 'params,' : '';
        const responseData = handleResponse(methods, value[methods], nativeObject.components.schemas);

        // const requestData = handleRequest(methods, value[methods], nativeObject.components.schemas);
        // `{methods === 'post'?"const {} = req.body;":""}`;
        mainContent += ` /** ${apiDesc} */
                    '${methods.toUpperCase()} ${key}': (req, res) => {
                      res.send(Mock.mock({
                        hasError: false,
                        errorId: '',
                        errorDesc: '',
                        data: ${responseData}
                      }));
                    },`;
      }

      content = content + `module.exports = {${mainContent}}`;
      fs.writeFileSync(mockPath, `${content}`, { encoding: 'utf-8' });
      /** 格式化文件 */
      exec('prettier --write ' + config.mockPath);
    })
    .catch((err) => {
      console.log(`err:`, err);
    });
};

generateMock();
