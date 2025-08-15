import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  Typography,
  Button,
  TableSortLabel,
  Skeleton,
  Box,
  TablePagination,
  Pagination,
} from "@mui/material";
import { Column, PaginationParams, SortParams } from "./type";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

type BaseTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  sort: SortParams<T>;
  handleSortChange: (field: keyof T) => void;
  pagination: PaginationParams;
  handlePaginationChange: (pagination: PaginationParams) => void;
  onDetailClick: (row: T) => void;
  isLoading: boolean;
  totalCount: number;
};

const BaseTable = <T extends { id: string }>({
  data,
  columns,
  selectedIds,
  setSelectedIds,
  handleSortChange,
  sort,
  pagination,
  onDetailClick,
  isLoading,
  handlePaginationChange,
  totalCount,
}: BaseTableProps<T>) => {
  const allSelected =
    data.length > 0 && data.every((row) => selectedIds.has(row.id));

  const someSelected =
    data.length > 0 && data.some((row) => selectedIds.has(row.id));

  const handleSelectAll = (checked: boolean) => {
    const pageIds = data.map((row) => row.id);
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (checked) {
        pageIds.forEach((id) => updated.add(id));
      } else {
        pageIds.forEach((id) => updated.delete(id));
      }
      return updated;
    });
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const renderSkeletonRows = () =>
    [...Array(pagination.perPage)].map((_, i) => (
      <TableRow key={`skeleton-${i}`} sx={{ height: 48 }}>
        <TableCell padding="checkbox">
          <Skeleton variant="rectangular" width={24} height={24} />
        </TableCell>
        {columns.map((_, j) => (
          <TableCell key={`skeleton-cell-${i}-${j}`}>
            <Skeleton variant="text" width="80%" />
          </TableCell>
        ))}
        <TableCell>
          <Skeleton variant="rectangular" width={60} height={30} />
        </TableCell>
      </TableRow>
    ));

  return (
    <>
      <TableContainer
        sx={{
          minHeight: pagination.perPage > 10 ? 640 : 560,
          maxHeight: "500px",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  indeterminate={someSelected && !allSelected}
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  disabled={isLoading}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  sortDirection={sort.field === col.id ? sort.direction : false}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sort.field === col.id}
                      direction={sort.field === col.id ? sort.direction : "asc"}
                      onClick={
                        isLoading ? undefined : () => handleSortChange(col.id)
                      }
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography variant="body2" color="textSecondary">
                    データがありません
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data.map((row) => {
                  const id = row.id;
                  const isSelected = selectedIds.has(id);
                  return (
                    <TableRow key={id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                        />
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={String(col.id)}>
                          {col.format
                            ? col.format(row[col.id], row)
                            : String(row[col.id])}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onDetailClick(row)}
                        >
                          <Typography variant="caption">詳細へ</Typography>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {Array.from({
                  length:
                    pagination.perPage > data.length
                      ? pagination.perPage - data.length
                      : 0,
                }).map((_, i) => (
                  <TableRow key={`empty-${i}`} style={{ height: 48 }}>
                    <TableCell colSpan={columns.length + 2} />
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mx: 2 }}
      >
        <TablePagination
          component="div"
          count={totalCount} // フィルタ後の総数など
          page={pagination.page}
          rowsPerPage={pagination.perPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={(_, newPage) =>
            handlePaginationChange({
              page: newPage,
              perPage: pagination.perPage,
            })
          }
          onRowsPerPageChange={(e) => {
            const perPage = parseInt(e.target.value, 10);
            if (!ROWS_PER_PAGE_OPTIONS.includes(perPage)) return;
            handlePaginationChange({
              page: 0,
              perPage,
            });
          }}
          labelRowsPerPage="表示件数:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}〜${to} 件 / 全${count}件`
          }
          ActionsComponent={() => null}
        />
        {totalCount > pagination.perPage && (
          <Pagination
            page={pagination.page + 1}
            count={Math.ceil(totalCount / pagination.perPage)}
            onChange={(_, page) =>
              handlePaginationChange({
                page: page - 1,
                perPage: pagination.perPage,
              })
            }
            color="primary"
            siblingCount={1} // 現在ページの前後に表示するページ数
            boundaryCount={1} // 最初と最後の近くに表示するページ数
          />
        )}
      </Box>
    </>
  );
};

export default BaseTable;
