import { useEffect, useState } from "react";
import { PaginationParams, SortParams, Task } from "./type";
import { generateTasksWithUsers } from "./task";

type TaskQueryParams = {
  keyword?: string; // ← query.query よりも直感的
  filter?: string; // 絞り込みが複数ある場合は object にしてもOK
  sort: SortParams<Task>;
  pagination: PaginationParams;
};

export const useTaskList = () => {
  // fetch. 本来はTanstackなどを使用
  const [tasks, setTasks] = useState<Task[]>([]); // 初期値は空
  const [isFetching, setIsFetching] = useState(false);
  const [queryParams, setQueryParams] = useState<TaskQueryParams>({
    sort: {
      field: "createdAt",
      direction: "desc",
    },
    pagination: {
      page: 0,
      perPage: 10,
    },
  });
  const [searchText, setSearchText] = useState(queryParams.keyword ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsFetching(true);
    const timer = setTimeout(() => {
      const data = generateTasksWithUsers(10, 10);
      setTasks(data);
      setIsFetching(false);
    }, 3000);

    return () => clearTimeout(timer); // クリーンアップ
  }, []); // 初回だけ

  useEffect(() => {
    setSelectedIds(new Set());
  }, [
    queryParams.filter,
    queryParams.keyword,
    queryParams.pagination.perPage,
    queryParams.sort.field,
    queryParams.sort.direction,
  ]);

  const filteredTasks = tasks.filter((task) => {
    if (queryParams.keyword) {
      return task.title.includes(queryParams.keyword);
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const { field, direction } = queryParams.sort;
    const aVal = a[field]?.toString() ?? "";
    const bVal = b[field]?.toString() ?? "";

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalCount = sortedTasks.length; // ← ページネーション用の全件数
  const data = sortedTasks.slice(
    queryParams.pagination.page * queryParams.pagination.perPage,
    (queryParams.pagination.page + 1) * queryParams.pagination.perPage
  );

  const handleSortChange = (field: keyof Task) => {
    setQueryParams((prev) => ({
      ...prev,
      sort: {
        field,
        direction:
          prev.sort.field === field && prev.sort.direction === "asc"
            ? "desc"
            : "asc",
      },
    }));
  };
  const handlePaginationChange = (paginationParams: PaginationParams) => {
    setQueryParams((prev) => ({
      ...prev,
      pagination: {
        ...paginationParams,
      },
    }));
  };

  const handleKeywordChange = (val: string) => {
    setQueryParams((prev) => ({
      ...prev,
      keyword: val,
    }));
  };

  return {
    queryParams,
    isFetching,
    tasks: data,
    totalCount,
    handleSortChange,
    handlePaginationChange,
    searchText,
    setSearchText: handleKeywordChange,
    selectedIds,
    setSelectedIds,
  };
};
