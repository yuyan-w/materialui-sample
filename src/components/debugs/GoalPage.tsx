import React from "react";
import { useMemo, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Autocomplete,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

/**
 * タスク型（例）—用途に合わせて調整してください
 */
type TaskStatus = "todo" | "in_progress" | "done";
type Task = {
  id: string;
  title: string;
  project?: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: string; // ISO "YYYY-MM-DD"
  tags?: string[];
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};

/**
 * フィルタ状態
 */
type TaskFilters = {
  q: string; // フリーテキスト検索（タイトル/担当/タグ/プロジェクトに対して）
  statuses: TaskStatus[];
  project: string | null;
  from: string | null; // 期間(開始) YYYY-MM-DD
  to: string | null; // 期間(終了) YYYY-MM-DD
};

const INITIAL_FILTERS: TaskFilters = {
  q: "",
  statuses: [],
  project: null,
  from: null,
  to: null,
};

/**
 * デバウンス用フック
 */
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * 検索 + フィルターバー
 */
function SearchFilterBar(props: {
  allProjects: string[];
  allStatuses: TaskStatus[];
  value: TaskFilters;
  onChange: (next: TaskFilters) => void;
  onClear?: () => void;
}) {
  const { allProjects, allStatuses, value, onChange, onClear } = props;

  // 入力中の値をデバウンスして親へ反映
  const [qInput, setQInput] = useState(value.q ?? "");
  const debouncedQ = useDebouncedValue(qInput, 250);
  useEffect(() => {
    if (debouncedQ !== value.q) onChange({ ...value, q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // 外部からvalue.qが変更されたとき入力欄へも同期
  useEffect(() => {
    setQInput(value.q ?? "");
  }, [value.q]);

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* フリーテキスト検索 */}
          <TextField
            size="small"
            label="検索（タイトル・担当・タグ・プロジェクト）"
            placeholder="例: レポート 作成 田中 #urgent"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: value.q ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="検索条件をクリア"
                    onClick={() => onChange({ ...value, q: "" })}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* ステータス（複数選択） */}
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">ステータス</InputLabel>
              <Select
                labelId="status-label"
                label="ステータス"
                multiple
                value={value.statuses}
                onChange={(e) =>
                  onChange({
                    ...value,
                    statuses: e.target.value as TaskStatus[],
                  })
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as TaskStatus[]).map((s) => (
                      <Chip key={s} label={STATUS_LABELS[s]} size="small" />
                    ))}
                  </Box>
                )}
              >
                {allStatuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* プロジェクト（単一選択） */}
            <Autocomplete
              options={allProjects}
              value={value.project}
              onChange={(_, newValue) =>
                onChange({ ...value, project: newValue })
              }
              renderInput={(params) => (
                <TextField {...params} size="small" label="プロジェクト" />
              )}
              fullWidth
              clearOnEscape
            />

            {/* 期限（From / To） */}
            <TextField
              label="期限(開始)"
              type="date"
              size="small"
              value={value.from ?? ""}
              onChange={(e) =>
                onChange({ ...value, from: e.target.value || null })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="期限(終了)"
              type="date"
              size="small"
              value={value.to ?? ""}
              onChange={(e) =>
                onChange({ ...value, to: e.target.value || null })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => onChange(INITIAL_FILTERS)}
              startIcon={<ClearIcon />}
            >
              条件をリセット
            </Button>
            {onClear && (
              <Button variant="text" onClick={onClear}>
                すべてクリア
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * クライアントサイドでのフィルタリング
 */
function useFilteredTasks(tasks: Task[] | undefined, filters: TaskFilters) {
  return useMemo(() => {
    if (!tasks || tasks.length === 0) return [] as Task[];
    const { q, statuses, project, from, to } = filters;

    const hasQ = q.trim().length > 0;
    const lowerQ = q.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    return tasks.filter((t) => {
      if (hasQ) {
        const haystack = `${t.title} ${t.assignee ?? ""} ${(t.tags ?? []).join(
          " "
        )} ${t.project ?? ""}`.toLowerCase();
        if (!haystack.includes(lowerQ)) return false;
      }
      if (statuses.length && !statuses.includes(t.status)) return false;
      if (project && t.project !== project) return false;
      if (fromDate && (!t.dueDate || new Date(t.dueDate) < fromDate))
        return false;
      if (toDate && (!t.dueDate || new Date(t.dueDate) > toDate)) return false;
      return true;
    });
  }, [tasks, filters]);
}

/**
 * --- 以下はデモ用: TanStack Queryで取得 → クライアントフィルタの流れ ---
 */
const queryClient = new QueryClient();

async function fetchTasks(): Promise<Task[]> {
  // デモ用にモックデータを返却（実装ではAPI呼び出しに置き換え）
  const mock: Task[] = [
    {
      id: "1",
      title: "レポート作成",
      project: "Alpha",
      status: "in_progress",
      assignee: "田中",
      dueDate: "2025-08-20",
      tags: ["urgent", "docs"],
    },
    {
      id: "2",
      title: "APIエンドポイント追加",
      project: "Beta",
      status: "todo",
      assignee: "佐藤",
      dueDate: "2025-08-18",
      tags: ["backend"],
    },
    {
      id: "3",
      title: "UI微調整（MUI v7）",
      project: "Alpha",
      status: "done",
      assignee: "鈴木",
      dueDate: "2025-08-10",
      tags: ["frontend", "mui"],
    },
    {
      id: "4",
      title: "テストケース作成",
      project: "Gamma",
      status: "in_progress",
      assignee: "渡辺",
      dueDate: "2025-08-25",
      tags: ["qa"],
    },
  ];

  return new Promise((resolve) => setTimeout(() => resolve(mock), 350));
}

function ResultsList({ tasks }: { tasks: Task[] }) {
  if (!tasks.length)
    return (
      <Typography color="text.secondary">該当するタスクはありません</Typography>
    );
  return (
    <Stack spacing={1}>
      {tasks.map((t) => (
        <Box
          key={t.id}
          sx={{
            p: 1.25,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {t.title}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 0.5 }}
              >
                <Chip size="small" label={t.project ?? "-"} />
                <Chip
                  size="small"
                  color={
                    t.status === "done"
                      ? "success"
                      : t.status === "in_progress"
                      ? "warning"
                      : "default"
                  }
                  label={STATUS_LABELS[t.status]}
                />
                {t.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    variant="outlined"
                    label={`#${tag}`}
                  />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                担当: {t.assignee ?? "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                期限: {t.dueDate ?? "-"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

function DemoInner() {
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  const allProjects = useMemo(
    () =>
      Array.from(
        new Set(tasks.map((t) => t.project).filter(Boolean))
      ) as string[],
    [tasks]
  );
  const allStatuses: TaskStatus[] = ["todo", "in_progress", "done"];

  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const filtered = useFilteredTasks(tasks, filters);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        タスク検索
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        TanStack Queryで取得したデータをクライアント側で絞り込みます。
      </Typography>

      <SearchFilterBar
        allProjects={allProjects}
        allStatuses={allStatuses}
        value={filters}
        onChange={setFilters}
        onClear={() => setFilters(INITIAL_FILTERS)}
      />

      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            結果:
          </Typography>
          <Chip label={`${filtered.length} 件`} size="small" />
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {isLoading ? (
          <Typography color="text.secondary">読み込み中...</Typography>
        ) : isError ? (
          <Typography color="error">データ取得に失敗しました</Typography>
        ) : (
          <ResultsList tasks={filtered} />
        )}
      </Box>
    </Box>
  );
}

export function SamplePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoInner />
    </QueryClientProvider>
  );
}
