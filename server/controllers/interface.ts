import http, { RequestOptions } from 'http';
import { Http2ServerRequest } from 'http2';

import InterfaceModel, { InterfaceItem } from '@/server/models/interface';
import Log from '@/server/utils/Log';
import axios from 'axios';
import jsf from 'json-schema-faker';
import { Context } from 'koa';
import yamljs from 'yamljs';

export const SyncData = async (ctx: Context) => {
  try {
    const { api, type } = ctx.request.body;
    const res = await axios.get(api);
    if (res.status === 200 && res.data) {
      const jsonData = yamljs.parse(res.data);
      //   const a = await jsf.resolve(jsonData);
      console.log(JSON.stringify(jsonData));
      return (ctx.body = jsonData);
    }

    //
  } catch (error) {
    Log.error(error);
  }
};
