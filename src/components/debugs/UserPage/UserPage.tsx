import { useEffect, useMemo, useState } from "react";
import { listUsersMock, User, UserRole } from "./user";
import MockLayout from "../../layout/MockLayout";
import { UsersList } from "./UsersList";
import { Box, Typography } from "@mui/material";
import { INITIAL_FILTERS, UserFilters } from "./filter";
import { UsersSearchButton } from "./UsersSearchButton";
import { UsersFilterChips } from "./UsersFilterChips";
import { INITIAL_SORT, UsersSort } from "./sort";
import { UsersSortControl } from "./UserSortControl";
import { useSortedUsers } from "./useSortUsers";
import { UsersSortButton } from "./UsersSortButton";

export const UserPage = () => {
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [sort, setSort] = useState<UsersSort>(INITIAL_SORT);

  useEffect(() => {
    const fetch = async () => {
      const result = await listUsersMock(10, { adminRatio: 0.4 });
      setUsers(result);
    };
    fetch();
  }, []);

  const [filters, setFilters] = useState<UserFilters>(INITIAL_FILTERS);

  const allRoles: UserRole[] = useMemo(
    () => Array.from(new Set(users?.map((u) => u.role))),
    [users]
  );

  const filteredUsers = useFilteredUsers(users, filters);
  const sortedUsers = useSortedUsers(filteredUsers, sort);

  const onFilterChange = (next: UserFilters) => {
    setFilters(next);
  };

  if (!filteredUsers) {
    return <div>loading....</div>;
  }

  const hasActiveFilters = (() => {
    return JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS);
  })();
  const hasActiveSorts = (() => {
    return JSON.stringify(sort) !== JSON.stringify(INITIAL_SORT);
  })();

  const onSortChange = (s: UsersSort) => {
    setSort(s);
  };

  return (
    <MockLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          position: "relative",
        }}
      >
        <Typography>ユーザー一覧</Typography>
        <UsersSearchButton
          allUserRoles={allRoles}
          value={filters}
          onChange={onFilterChange}
          hasActiveFilters={hasActiveFilters}
        />
        <UsersSortButton
          value={sort}
          onChange={onSortChange}
          hasActiveSort={hasActiveSorts}
        />
        <UsersFilterChips value={filters} onChange={onFilterChange} />
        <UsersList users={sortedUsers} />
      </Box>
    </MockLayout>
  );
};

const useFilteredUsers = (
  users: User[] | undefined,
  filters: UserFilters
): User[] => {
  return useMemo(() => {
    if (!users || users.length === 0) return [];
    const { q, roles } = filters;
    const hasQ = q.trim().length > 0;
    const lowerQ = q.trim().toLowerCase();

    return users.filter((u) => {
      if (hasQ) {
        const haystack = `${u.name} ${u.email}`.toLowerCase();

        if (!haystack.includes(lowerQ)) return false;
      }
      if (roles.length && !roles.includes(u.role)) return false;
      return true;
    });
  }, [users, filters]);
};
