/* eslint-disable func-names */
/* eslint-disable no-param-reassign */

import moment from "moment";
import MD5 from 'crypto-js/md5';

// 获取随机id
export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// 时间格式化
export function timeToFormat(times: number, showMs?: boolean) {
  let result = showMs ? "00:00.000" : "00:00";
  let hour: string | number;
  let minute: string | number;
  let second: string | number;

  if (times > 0) {
    hour = Math.floor(times / 3600);
    if (hour < 10) {
      hour = `0${hour}`;
    }
    minute = Math.floor((times - 3600 * (hour as number)) / 60);
    if (minute < 10) {
      minute = `0${minute}`;
    }

    second = (times - 3600 * (hour as number) - 60 * (minute as number)) % 60;
    let s = showMs ? second.toFixed(3) : Math.floor(second);
    if (second < 10) {
      s = `0${s}`;
    }
    if (hour > 0) {
      result = `${hour}:${minute}:${
        showMs ? second.toFixed(3) : second.toFixed(0)
      }`;
    } else {
      result = `${minute}:${s}`;
    }
  }
  return result;
}
/**
 * 函数防抖
 *
 * @param {Function} func 执行函数
 * @param {number} [wait=0] 延迟时间(ms)
 * @returns {Function} 回调防抖函数
 * @message 将几次操作合并为一此操作进行、适用于resize或者鼠标移动事件，防止浏览器频繁响应事件，严重拉低性能
 */
export function debounce(func: Function, wait = 120) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(func.bind(null, ...args), wait);
  };
}

// 日期格式化 YYYY-MM-DD HH:mm:ss
export const formatDate = (
  time: any,
  pattern = "YYYY-MM-DD HH:mm:ss"
): string => {
  if (!time) return "-";
  if (typeof time === "string" && time.indexOf("1970-01-01") !== -1) {
    return "-";
  }
  let momentTime = null;
  if (/^[0-9]+$/.test(time)) {
    momentTime = moment.unix(
      time && `${time}`.length > 11 ? time / 1000 : time
    );
  } else {
    momentTime = moment(time);
  }
  const transTime = momentTime.format(pattern);
  if (transTime === "Invalid Date" || Number.isNaN(Date.parse(transTime))) {
    return "";
  }
  return transTime;
};

// 展开routes
function flatRouter(router: RouteConfig[], newRoutes: RouteConfig[] = []) {
  router.forEach((item) => {
    const { routes, ...rest } = item;
    if (routes) {
      flatRouter(routes, newRoutes);
    } else if (rest.path) {
      newRoutes.push(rest);
    }
  });
  return newRoutes;
}

export function addZeroes(num: number) {
  return num.toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: 1,
  });
}

/**
 * 下载流文件
 * @param {Blob} result
 * @param {String} fileName
 * @param {String} type
 */
export function downloadBlobFile(result: any, fileName: string, type = "xlsx") {
  const blob = new Blob([result]);
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = `${fileName}.${type}`; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}
/**
 * params json对象(一级)拼接url ?后面的参数
 * @param  {String} url  需要拼接的url
 * @param  {Objct}  params 需要拼接的url json参数
 * @return {String}    拼接的url
 */
export function joinUrlParams(url: string, params: Record<string, any>) {
  let p = "";
  let i = 0;

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (i === 0 && !~url.indexOf("?")) {
      p += `?${key}=${value}`;
    } else {
      p += `&${key}=${value}`;
    }
    i++;
  });

  return url + p;
}

interface WavParams {
  start?: any;
  end?: any;
  file_id: any;
}

export function formatPassword(val: string) {
  //@ts-ignore

  return MD5(val).toString().toLowerCase();
}

// 文件名后缀全改为.wav
export function changeWav(name: string) {
  if (!name) return;
  return name.substring(0, name.lastIndexOf(".") + 1) + "wav";
}

export function hexToRgbA(hex: string) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    // @ts-ignore
    return (
      //@ts-ignore
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.5)"
    );
  }
  throw new Error("Bad Hex");
}
