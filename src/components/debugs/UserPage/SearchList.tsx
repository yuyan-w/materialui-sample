import React, { useEffect, useState } from "react";
import { INITIAL_FILTERS, UserFilters } from "./filter";
import { USER_ROLE_LABELS, UserRole } from "./user";
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
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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

interface SearchListProps {
  allUserRoles: UserRole[];
  value: UserFilters;
  onChange: (next: UserFilters) => void;
  embedded?: boolean; // ←追加
}

export const SearchList = ({
  allUserRoles,
  value,
  onChange,
  embedded,
}: SearchListProps) => {
  const [qInput, setQInput] = useState(value.q ?? "");
  const debouncedQ = useDebouncedValue(qInput);

  useEffect(() => {
    const next = value.q ?? "";
    setQInput((prev) => (prev !== next ? next : prev));
  }, [value.q]);

  useEffect(() => {
    if (debouncedQ !== value.q) onChange({ ...value, q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const handleClear = () => {
    setQInput("");
    onChange(INITIAL_FILTERS);
  };

  const content = (
    <Stack spacing={2}>
      {/* フリーテキスト検索 */}
      <TextField
        size="small"
        label="検索（ユーザー名、メールアドレス）"
        placeholder="例: 田中 @gmail"
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
            value={value.roles}
            onChange={(e) =>
              onChange({
                ...value,
                roles: e.target.value as UserRole[],
              })
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as UserRole[]).map((s) => (
                  <Chip key={s} label={USER_ROLE_LABELS[s]} size="small" />
                ))}
              </Box>
            )}
          >
            {allUserRoles.map((s) => (
              <MenuItem key={s} value={s}>
                {USER_ROLE_LABELS[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={handleClear}
          startIcon={<ClearIcon />}
        >
          条件をリセット
        </Button>
      </Stack>
    </Stack>
  );

  if (embedded) {
    return <Box sx={{ p: 1 }}>{content}</Box>;
  }

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}
    >
      <CardContent>{content}</CardContent>
    </Card>
  );
};
