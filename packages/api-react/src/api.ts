import { createApi } from '@reduxjs/toolkit/query/react';

import treeLazyBaseQuery from './treeLazyBaseQuery';

export const baseQuery = treeLazyBaseQuery({});

export default createApi({
  reducerPath: 'treeApi',
  baseQuery,
  endpoints: () => ({}),
});
