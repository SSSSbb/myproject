export type TableListItem = {
  id: number;
  eid:number;
  maintainer: string;
  enp_sign: Blob;
  project:string;
  work:string;
  parts_record:number;
  safe_sign:Blob;
  safer:string;
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
  eid:number;
  maintainer: number;
  project:string;
  work:string;
  parts_record:number;
  maintainer_id:number;
  safer:string;
  safer_id:number;
  belongto?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
