import { useMemo } from "react";
import { UsersSort } from "./sort";
import { User, UserRole } from "./user";

const ROLE_WEIGHT: Record<UserRole, number> = { ADMIN: 0, MEMBER: 1 };

function sortUsers(list: User[], s: UsersSort): User[] {
  const dir = s.direction === "asc" ? 1 : -1;
  const get = (u: User) => {
    switch (s.key) {
      case "name":
        return u.name.toLowerCase();
      case "email":
        return u.email.toLowerCase();
      case "role":
        return ROLE_WEIGHT[u.role];
    }
  };
  // 安定ソート（値が同じ時は元の順序を保持）
  return list
    .map((item, i) => ({ item, i }))
    .sort((a, b) => {
      const av = get(a.item),
        bv = get(b.item);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return a.i - b.i;
    })
    .map((x) => x.item);
}

export const useSortedUsers = (users: User[], s: UsersSort) =>
  useMemo(() => sortUsers(users, s), [users, s]);
