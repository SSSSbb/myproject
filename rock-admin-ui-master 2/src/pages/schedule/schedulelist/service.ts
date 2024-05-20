import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function querySchedule(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/schedule/schedulelist/index`, {
    method: 'GET',
    params,
  });
}
// export async function addPreferences(payload: TableListItem) {
//   console.log({ payload });
//   return request<API.Response<any>>(`/api/schedule/preferences/create`, {
//     method: 'POST',
//     data: {
//       ...payload,
//     },
//   });
// }

export async function updateSchedule(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/schedule/schedulelist/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

// export async function deletePreferences(id: number) {
//   return request(`/api/schedule/preferences/delete`, {
//     method: 'GET',
//     params: {
//       id,
//     },
//   });
// }

// export async function generate(belongto:number) {
//   return request(`/api/schedule/preferences/generate`, {
//     method: 'GET',
//     params: {
//       belongto,
//     },
//   });
// }
