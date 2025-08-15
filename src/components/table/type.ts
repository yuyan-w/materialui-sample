/** ユーザー型 */
export type User = {
  id: string; // UUIDやULIDなど
  name: string;
  email: string;
};

/** タスクのステータス（3値に限定） */
export type TaskStatus = "todo" | "in_progress" | "done";

/** タスク型 */
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO文字列 or Date
  createdBy: User;
};

export type Column<T> = {
  id: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  minWidth?: number;
  format?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
};

export type ResourceTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  onSearch?: (query: string, filters?: Record<string, unknown>) => void;
  filters?: React.ReactNode;
  actions?: (selected: T[]) => React.ReactNode;
  page: number;
  rowsPerPage: number;
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newRowsPerPage: number) => void;
};

export type SortParams<T> = {
  field: keyof T;
  direction: "asc" | "desc";
};

export type PaginationParams = {
  page: number;
  perPage: number;
};
