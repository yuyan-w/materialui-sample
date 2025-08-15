import { useState } from "react";
import {
  Paper,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Column, Task } from "./type";
import BaseTable from "./BaseTable";
import { useTaskList } from "./useTaskList";
import { DebouncedInput } from "./DebouncedInput";
import { useModal } from "./useModal";
import { BaseModal } from "./BaseModal";

const columns: Column<Task>[] = [
  { id: "title", label: "タイトル", sortable: true },
  { id: "status", label: "ステータス" },
  {
    id: "createdBy",
    label: "作成者",
    format: (_, row) => row.createdBy.name,
  },
  {
    id: "createdAt",
    label: "作成日",
    format: (val) => {
      if (typeof val === "string") {
        return new Date(val).toLocaleDateString();
      }
      return "";
    },
    sortable: true,
  },
];

const roles = [
  { value: "admin", label: "管理者" },
  { value: "manager", label: "マネージャー" },
  { value: "staff", label: "スタッフ" },
];

export function TaskListPage() {
  const {
    queryParams,
    searchText,
    handlePaginationChange,
    tasks,
    setSearchText,
    handleSortChange,
    totalCount,
    isFetching,
    selectedIds,
    setSelectedIds,
  } = useTaskList();

  const { isOpen, open: modalOpen, close } = useModal();

  const [role, setRole] = useState("staff");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 一括操作メニューの開閉状態を管理
  const menuOpen = Boolean(anchorEl);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        border: "2px dashed red",
        p: 2,
        maxWidth: "1000px",
        mx: "auto",
        mt: 4,
      }}
    >
      <Paper sx={{ width: "100%" }}>
        {/* ヘッダー部 */}
        <Toolbar>
          <Typography>共通テーブル</Typography>
          <Box sx={{ ml: "auto" }}>
            <Button
              variant="outlined"
              onClick={handleMenuClick}
              disabled={selectedIds.size === 0}
            >
              一括操作
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  modalOpen();
                }}
              >
                更新
              </MenuItem>
              <MenuItem sx={{ color: "error.main" }} onClick={handleMenuClose}>
                削除
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* 検索 + ページネーション */}
        <Toolbar>
          <Stack direction={"row"} spacing={3}>
            <Box sx={{ display: "flex" }}>
              <DebouncedInput
                label="検索"
                value={searchText}
                onChange={(val) => setSearchText(val)}
                placeholder="キーワードを入力"
                size="small"
                sx={{ width: "240px" }}
              />
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel id="role-label">権限</InputLabel>
                <Select
                  sx={{ minWidth: "200px" }}
                  labelId="role-label"
                  id="role-select"
                  value={role}
                  label="権限"
                  onChange={handleSelectChange}
                >
                  {roles.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Toolbar>

        <BaseTable
          data={tasks}
          columns={columns}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleSortChange={handleSortChange}
          sort={queryParams.sort}
          pagination={queryParams.pagination}
          onDetailClick={(row) => console.log(`User clicked: ${row.id}`)}
          isLoading={isFetching}
          handlePaginationChange={handlePaginationChange}
          totalCount={totalCount}
        />
      </Paper>
      <BaseModal
        open={isOpen}
        onClose={close}
        title="ユーザー削除の確認"
        actions={
          <>
            <Button onClick={close}>キャンセル</Button>
            <Button
              color="error"
              onClick={() => {
                close();
              }}
            >
              削除する
            </Button>
          </>
        }
      >
        本当にこのユーザーを削除してもよろしいですか？
      </BaseModal>
    </Box>
  );
}
