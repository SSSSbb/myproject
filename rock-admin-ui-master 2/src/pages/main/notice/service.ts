import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function queryNotice(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/main/notice/index`, {
    method: 'GET',
    params,
  });
}
export async function addNotice(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/main/notice/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updateNotice(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/main/notice/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deleteNotice(id: number) {
  return request(`/api/main/notice/delete`, {
    method: 'GET',
    params: {
      id,
    },
  });
}
