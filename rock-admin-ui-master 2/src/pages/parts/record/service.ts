import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function querypartsrecord(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/parts/record/index`, {
    method: 'GET',
    params,
  });
}
export async function addPartsrecord(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/parts/record/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updatePartsrecord(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/parts/record/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deletePartsrecord(id: number) {
  return request(`/api/parts/record/delete`, {
    method: 'GET',
    params: {
      id,
    },
  });
}
