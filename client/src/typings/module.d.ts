declare module '*.css';
declare module '*.png';
declare module '*.ico';
declare module '*.js';
declare module '*.json';
declare module '*.node';
declare module '*.mp4';
declare module '*.gif';

declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

/** 返回地址 */
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'echarts' {
  const echarts: any;
  export default echarts;
}
