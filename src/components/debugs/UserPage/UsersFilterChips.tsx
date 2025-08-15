import * as React from "react";
import { Stack, Chip, Typography, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { INITIAL_FILTERS, type UserFilters } from "./filter";
import { USER_ROLE_LABELS, type UserRole } from "./user";

type UsersFilterChipsProps = {
  value: UserFilters;
  onChange: (next: UserFilters) => void;
  showLabel?: boolean; // "検索条件:" のラベルを表示するか
};

export const UsersFilterChips: React.FC<UsersFilterChipsProps> = ({
  value,
  onChange,
  showLabel = true,
}) => {
  const q = value.q?.trim() ?? "";
  const roles = value.roles ?? [];

  const hasAny = q.length > 0 || (Array.isArray(roles) && roles.length > 0);

  if (!hasAny) return null; // 条件がない時は非表示（好みで "条件なし" 表示にしてもOK）

  const removeKeyword = () => onChange({ ...value, q: "" });
  const removeRole = (role: UserRole) =>
    onChange({ ...value, roles: roles.filter((r) => r !== role) });
  const clearAll = () => onChange(INITIAL_FILTERS);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
      sx={{ my: 1 }}
    >
      {showLabel && (
        <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
          検索条件:
        </Typography>
      )}

      {/* キーワード */}
      {q && (
        <Chip
          size="small"
          label={`キーワード: ${q}`}
          onDelete={removeKeyword}
          variant="outlined"
        />
      )}

      {/* 役割（複数） */}
      {roles.map((role) => (
        <Chip
          key={role}
          size="small"
          label={`権限: ${USER_ROLE_LABELS[role]}`}
          onDelete={() => removeRole(role)}
          variant="outlined"
        />
      ))}

      {/* すべてクリア */}
      <Button
        size="small"
        variant="text"
        onClick={clearAll}
        startIcon={<ClearIcon fontSize="small" />}
        sx={{ ml: 0.5 }}
      >
        すべてクリア
      </Button>
    </Stack>
  );
};
