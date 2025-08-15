import { UserRole } from "./user";

export type UserFilters = {
  q: string; // フリーテキスト検索（タイトル/担当/タグ/プロジェクトに対して）
  roles: UserRole[];
};

export const INITIAL_FILTERS: UserFilters = {
  q: "",
  roles: [],
};
