import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function queryMaintainRecord(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/maintain/record/index`, {
    method: 'GET',
    params,
  });
}
export async function addMaintainRecord(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/maintain/record/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updateMaintainRecord(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/maintain/record/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deleteMaintainRecord(id: number) {
  return request(`/api/maintain/record/delete`, {
    method: 'GET',
    params: {
      id,
    },
  });
}
