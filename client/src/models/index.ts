import type { Models } from '@rematch/core';

import { global } from './global';
import { tree } from './tree';

export interface RootModel extends Models<RootModel> {
  global: typeof global;
  tree: typeof tree;
}

export const models: RootModel = { global, tree };
