// QuickFilter.tsx
import * as React from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { type UserRole, USER_ROLE_LABELS } from "./user";
import { INITIAL_FILTERS, type UserFilters } from "./filter";

export type UsersQuickFilterId = "all" | "admin" | "member";

type QuickFilterPreset = {
  id: UsersQuickFilterId;
  label: string;
  icon?: React.ReactNode;
  apply: (f: UserFilters) => UserFilters;
  isActive: (f: UserFilters) => boolean;
};

const PRESETS: QuickFilterPreset[] = [
  {
    id: "all",
    label: "すべて",
    icon: <FilterAltOffIcon fontSize="small" />,
    apply: (f) => ({ ...f, roles: [] }), // ロール条件をクリア
    isActive: (f) => (f.roles?.length ?? 0) === 0,
  },
  {
    id: "admin",
    label: USER_ROLE_LABELS["ADMIN" as UserRole],
    icon: <AdminPanelSettingsIcon fontSize="small" />,
    apply: (f) => ({ ...f, roles: ["ADMIN" as UserRole] }),
    isActive: (f) =>
      f.roles?.length === 1 && f.roles[0] === ("ADMIN" as UserRole),
  },
  {
    id: "member",
    label: USER_ROLE_LABELS["MEMBER" as UserRole],
    icon: <PersonOutlineIcon fontSize="small" />,
    apply: (f) => ({ ...f, roles: ["MEMBER" as UserRole] }),
    isActive: (f) =>
      f.roles?.length === 1 && f.roles[0] === ("MEMBER" as UserRole),
  },
];

export type UsersQuickFilterProps = {
  value: UserFilters;
  onChange: (next: UserFilters) => void;
  presets?: QuickFilterPreset[];
  size?: "small" | "medium";
  exclusive?: boolean; // trueなら排他（1つだけ選択）
  resetOnDeselect?: boolean; // 同じボタンを再クリックで全解除するか（排他時）
};

export const UsersQuickFilter: React.FC<UsersQuickFilterProps> = ({
  value,
  onChange,
  presets = PRESETS,
  size = "small",
  exclusive = true,
  resetOnDeselect = true,
}) => {
  // 現在どのプリセットが効いているか（排他想定）
  const active = React.useMemo(
    () => presets.find((p) => p.isActive(value))?.id ?? null,
    [value, presets]
  );

  const handleChange = (_: unknown, nextId: UsersQuickFilterId | null) => {
    // 排他モードで同じボタンをもう一度押したら解除
    if (exclusive && resetOnDeselect && nextId === null) {
      onChange({ ...value, roles: [] });
      return;
    }
    const preset = presets.find((p) => p.id === (nextId ?? "all"));
    if (preset) onChange(preset.apply(value));
  };

  return (
    <ToggleButtonGroup
      exclusive={exclusive}
      value={exclusive ? active : null}
      onChange={handleChange}
      size={size}
    >
      {presets.map((p) => (
        <Tooltip title={p.label} placement="top" key={p.id}>
          <ToggleButton value={p.id} selected={p.isActive(value)}>
            {p.icon}
            <span style={{ marginLeft: p.icon ? 6 : 0 }}>{p.label}</span>
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
};
