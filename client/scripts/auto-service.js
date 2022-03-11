const fs = require("fs");

const config = require("./config.js");

const path = require("path");

const servicePath = path.join(process.cwd(), config.servicePath);

const YAML = require("yamljs");

const axios = require("axios");

const { exec } = require("child_process");
let findInner = `
/**
 * @readOnly {只读， 脚本更改}
 * @Message {来源} {npm run codec:swagger}
 * @Swagger 自动生成接口请求信息
*/
import type { AxiosRequestConfig} from '@/utils/request';
import axiosInstance, { InjectAbort } from '@/utils/request';

import type { BaseServeResponse } from '@/typings/BaseTypes';
`;

let ItemInterface = ``;

const set = new Set();

const handleRef = (key, value, schemasObject) => {
  const schemas = value.$ref.split("#/components/schemas/")[1];
  let properties = schemasObject[schemas].properties;
  let _string = ``;
  for (const [key, val] of Object.entries(properties)) {
    _string += `
          /** ${val.description} */
          ${key}: ${
      val.type === "array"
        ? handleArrayInterface(key, val, schemasObject)
        : val.$ref
        ? handleRef(key, val, schemasObject)
        : val.type
    };`;
  }
  return _string;
};

const handleArrayInterface = (key, value, schemasObject) => {
  key = key
    .split("_")
    .map((item) => {
      item = item.split("").map((k, i) => {
        if (i === 0) {
          return k.toLocaleUpperCase();
        }
        return k;
      });
      item = item.join("");
      return item;
    })
    .join("");
  if (value.items.$ref) {
    const schemas = value.items.$ref.split("#/components/schemas/")[1];
    let properties = schemasObject[schemas].properties;
    let _string = ``;

    for (const [key, val] of Object.entries(properties)) {
      _string += `
            /** ${val.description} */
            ${key}: ${
        val.type === "array"
          ? handleArrayInterface(key, val, schemasObject)
          : val.$ref
          ? `{${handleRef(key, val, schemasObject)}}`
          : val.type
      };`;
    }
    const itemInterface = `\nexport interface ${schemas}ItemTypes {${_string}\n}`;

    ItemInterface += itemInterface;

    return `${schemas}ItemTypes[]`;
  } else {
    return `${value.items.type}[]`;
  }
};

const handleRequest = (name, value, schemasObject) => {
  const requestBodyContent = value.requestBody
    ? value.requestBody.content
    : null;

  const ContentType = requestBodyContent && Object.keys(requestBodyContent)[0];

  if (ContentType === "application/octet-stream") {
    return `export type ${name}Request = string | ArrayBuffer`;
  }

  let schemas = "";

  try {
    schemas = requestBodyContent[ContentType].schema.$ref.split(
      "#/components/schemas/"
    )[1];
  } catch (error) {
    return `export interface ${name}Request {}`;
  }

  if (!schemas) {
    return `export interface ${name}Request {}`;
  }

  let properties = schemasObject[schemas].properties || {};

  let reqString = ``;

  for (const [key, value] of Object.entries(properties)) {
    if (!value.type && value.$ref) {
      const dd = value.$ref.split("#/components/schemas/")[1];

      let properties = schemasObject[dd].properties;

      let _string = ``;
      for (const [key, val] of Object.entries(properties)) {
        _string += `
        /** ${val.description} */
        ${key}: ${
          val.type === "array"
            ? handleArrayInterface(key, val, schemasObject)
            : val.type
        };`;
      }
      reqString += `
      /** ${value.description} */
      ${key}: {${_string}};`;
    } else {
      /** 处理枚举类型 */
      function handleEnum(enumData) {
        return enumData.map((i) => `"${i}"`).join("|");
      }

      reqString += `
    /** ${value.description} */
    ${key}: ${
        value.type === "array"
          ? handleArrayInterface(key, value, schemasObject)
          : value.enum
          ? handleEnum(value.enum)
          : value.type
      };`;
    }
  }

  const string = `export interface ${name}Request {${reqString}
}`;

  return string;
};

const handleResponse = (name, value, schemasObject) => {
  let schemas = "";

  try {
    schemas = value.responses["200"].content[
      "application/json"
    ].schema.$ref.split("#/components/schemas/")[1];
  } catch (error) {
    return `export interface ${name}Response {}`;
  }

  if (!schemas) {
    return `export interface ${name}Response {}`;
  }

  let resString = "";
  let properties = schemasObject[schemas].properties || {};

  for (const [key, value] of Object.entries(properties)) {
    console.log(value);
    if (value && !value.type && value.$ref) {
      const dd = value.$ref.split("#/components/schemas/")[1];
      let properties = schemasObject[dd].properties;
      let _string = ``;

      for (const [key, val] of Object.entries(properties)) {
        _string += `
            /** ${val.description} */
            ${key}: ${
          val.type === "array"
            ? handleArrayInterface(key, val, schemasObject)
            : val.type
        };`;
      }
      resString += `
            /** ${value.description} */
            ${key}: {${_string}};`;
    } else {
      if (value) {
        resString += `
      /** ${value.description} */
      ${key}: ${
          value.type === "array"
            ? handleArrayInterface(key, value, schemasObject)
            : value.type
        };`;
      }
    }
  }
  return `export interface ${name}Response {${resString}
}`;
};

const handleParams = (name, parameters, schemasObject) => {
  if (parameters) {
    let paramsStr = parameters.reduce((str, item, index) => {
      return (str += `\r\n  ${item.name}:${item.schema.type};`);
    }, `export interface ${name}Params {`);

    return (paramsStr += `\r\n}`);
  }
  return "";
};

const call = (methods, __name) => {
  if (methods === "get") {
    return `InjectAbort(${__name}, request))`;
  }
  return ` request, InjectAbort(${__name}, config))`;
};

axios
  .request({ url: config.docUrl, method: "get" })
  .then(({ data }) => {
    nativeObject = YAML.parse(data);
    for (const [key, value] of Object.entries(nativeObject.paths)) {
      const methods = Object.keys(value)[0];
      const requestBodyContent = value[methods].requestBody
        ? value[methods].requestBody.content
        : null;
      const parameters = value[methods].parameters || null;
      const ContentType =
        requestBodyContent && Object.keys(requestBodyContent)[0];
      const names = key.split("/");
      const capital = (word) => word.replace(/^\S/, (s) => s.toUpperCase());

      const lastName = capital(names[names.length - 1]);
      const lastSecondName = capital(names[names.length - 2]);
      const __name = lastSecondName + lastName;

      const requestBody = requestBodyContent ? `data: ${__name}Request,` : "";
      const dataConfig = requestBodyContent ? "data," : "";
      const requestParams = parameters ? `params: ${__name}Params,` : "";
      const paramsConfig = parameters ? "params," : "";

      findInner += `
/** ========================= **************** ${__name} ****************** ========================= */

/** ${value[methods].description} 请求参数 */
${handleRequest(__name, value[methods], nativeObject.components.schemas)}
${handleParams(__name, parameters, nativeObject.components.schemas)}
/** ${value[methods].description} 响应参数*/
${handleResponse(__name, value[methods], nativeObject.components.schemas)}
/** ${value[methods].description} */
export const ${__name} = (${requestBody} ${requestParams} config?: AxiosRequestConfig):Promise<BaseServeResponse<${__name}Response>> => {
  return axiosInstance({
    url:'${key}',
    method: '${methods}',
    ${paramsConfig}
    ${dataConfig}${paramsConfig}
    headers: { "Content-Type": "${ContentType || "application/json"}" },
    ...InjectAbort(${__name}, config)
  })
};
`;
    }

    fs.writeFileSync(
      servicePath,
      `${findInner}\n${ItemInterface}`
        .replace(/integer/g, "number")
        .replace(/array/g, "[]"),
      { encoding: "utf-8" }
    );

    exec("prettier --write " + config.servicePath);
  })
  .catch((err) => {
    console.log(`err:`, err);
  });
