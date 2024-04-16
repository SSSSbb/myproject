export type TableListItem = {
  id: number;
  partsid:number;
  name: string;
  maintaintype:string;
  status: string;
  which: number;
  last_maintain:string;
  last_repair:string;
  diposed_at:string;
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
  id?: number;
  partsid:number;
  name: string;
  maintaintype:string;
  status: string;
  which: number;
  belongto?: number;
  last_maintain:string;
  last_repair:string;
  diposed_at:string;  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
