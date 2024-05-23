export type TableListItem = {
  id?: number;
  username: string;
  which: number;
  status: number;
  createby:string;
  content:string;
  created_at?: string;
  finish_at?: string;
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
  username: string;
  which: number;
  status: number;
  createby:string;
  belongto?: number;
  created_at?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
