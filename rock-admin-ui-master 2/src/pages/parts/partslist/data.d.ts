export type TableListItem = {
  id: number;
  name: string;
  spec: string;
  model: string;
  man: string;
   sup: string;
  remain:number;
  used:number;
  diposed:number;
  buy_at?: string;
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
  name: string;
  man: string;
  sup: string;
  belongto?: number;
  buy_at?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
