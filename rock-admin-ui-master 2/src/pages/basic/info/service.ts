import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function queryInfo(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/basic/info/index`, {
    method: 'GET',
    params,
  });
}
export async function addInfo(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/basic/info/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updateInfo(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/basic/info/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deleteInfo(id: number) {
  return request(`/api/basic/info/delete`, {
    method: 'GET',
    params: {
      id,
    },
  });
}
