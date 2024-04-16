export type TableListItem = {
  id?: number;
  profileid: number;
  name: string;
  info: string;
  belongto?: number;
  created_at?: string;
  updated_at?: string;
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
  id?: number;
  profileid: number;
  name: string;
  belongto?: number;
  created_at?: string;
  updated_at?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
