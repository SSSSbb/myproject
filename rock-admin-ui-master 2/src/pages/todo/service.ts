import { request } from 'umi';

import type { TableListItem, TableListItemResponse, TableListParams } from './data';

export async function queryTodo(params?: TableListParams) {
  return request<API.Response<TableListItemResponse>>(`/api/todo/index`, {
    method: 'GET',
    params,
  });
}
export async function addTodo(payload: TableListItem) {
  console.log({ payload });
  return request<API.Response<any>>(`/api/todo/create`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function updateTodo(payload: TableListItem) {
  console.log({ payload });
  return request(`/api/todo/update`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function deleteTodo(id: number) {
  return request(`/api/todo/delete`, {
    method: 'GET',
    params: {
      id,
    },
  });
}
