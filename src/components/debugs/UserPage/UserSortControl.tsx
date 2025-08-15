import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { UsersSort, UsersSortKey } from "./sort";

export const UsersSortControl = ({
  value,
  onChange,
}: {
  value: UsersSort;
  onChange: (s: UsersSort) => void;
}) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControl size="small">
        <InputLabel id="sort-key">並び替え</InputLabel>
        <Select
          labelId="sort-key"
          label="並び替え"
          value={value.key}
          onChange={(e) =>
            onChange({ ...value, key: e.target.value as UsersSortKey })
          }
        >
          <MenuItem value="name">名前</MenuItem>
          <MenuItem value="email">メール</MenuItem>
          <MenuItem value="role">権限</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={value.direction}
        onChange={(_, dir) => dir && onChange({ ...value, direction: dir })}
      >
        <ToggleButton value="asc">昇順</ToggleButton>
        <ToggleButton value="desc">降順</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};
