export type TableListItem = {
  id: number;
  username: string;
  userid: number;
  create_time: string;
  slot:number;
  weekday:number;
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
  userid: number;
  create_time: string;
  slot:number;
  weekday:number;
  belongto?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
