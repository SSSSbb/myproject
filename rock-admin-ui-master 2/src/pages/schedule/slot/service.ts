import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function querySlot(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/schedule/slot/index`, {
    method: 'GET',
    params,
  });
}

export async function updateSlot(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/schedule/slot/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}


