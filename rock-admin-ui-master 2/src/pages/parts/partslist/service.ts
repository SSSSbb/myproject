import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function queryparts(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/parts/partslist/index`, {
    method: 'GET',
    params,
  });
}
export async function addParts(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/parts/partslist/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updateParts(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/parts/partslist/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deleteParts(id: number) {
  return request(`/api/parts/partslist/delete`, {
    method: 'GET',
    params: {
      id,
    },
  });
}
