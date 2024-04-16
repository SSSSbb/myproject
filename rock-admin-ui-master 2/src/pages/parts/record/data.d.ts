export type TableListItem = {
  id: number;
  record_id: number;
  part_id: number;
  action:string;
  replace_part:number;
  extrainfo:string;
  create_at:string;
  update_at:string;
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
  record_id: number;
  part_id: number;
  action:string;
  replace_part:number;
  extrainfo:string;
  belongto?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
