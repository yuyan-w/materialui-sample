export type UsersSortKey = "name" | "email" | "role";
export type UsersSort = { key: UsersSortKey; direction: "asc" | "desc" };
export const INITIAL_SORT: UsersSort = {
  key: "name",
  direction: "asc",
};
