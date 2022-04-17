import type { RematchDispatch, RematchRootState } from '@rematch/core';
import { init } from '@rematch/core';

import type { RootModel } from './models';
import { models } from './models';

export const store = init({
  models
});
export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
