export type TableListItem = {
  id: number;
  userid: string;
  no_work_day: number;
  no_more_than_time: number;
  created_at?: string;
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
  userid: string;
  no_work_day: number;
  no_more_than_time: number;
  belongto?: number;
  created_at?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
