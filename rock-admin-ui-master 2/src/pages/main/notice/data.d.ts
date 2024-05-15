export type TableListItem = {
  id: number;
  createby: string;
  content:string;
  status:number;
  created_at:string;
  updated_at:string;
  belongto?: number;
};

export type TableListItemResponse = {
  list: TableListItem[];
  page_num: number;
  page_size: number;
  total: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  id: number;
  createby: string;
  content:string;
  status:number;
  belongto?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};