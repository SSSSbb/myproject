import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function querypartsprofile(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/parts/partsprofile/index`, {
    method: 'GET',
    params,
  });
}
export async function addPartsProfile(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/parts/partsprofile/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updatePartsProfile(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/parts/partsprofile/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deletePartsProfile(id: number,partsid:number) {
  return request(`/api/parts/partsprofile/delete`, {
    method: 'GET',
    params: {
      id,
      partsid,
    },
  });
}
