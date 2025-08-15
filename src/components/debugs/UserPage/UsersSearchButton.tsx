import * as React from "react";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Popover,
  SwipeableDrawer,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchList } from "./SearchList";
import type { UserFilters } from "./filter";
import type { UserRole } from "./user";

type UsersSearchButtonProps = {
  allUserRoles: UserRole[];
  value: UserFilters;
  onChange: (next: UserFilters) => void;
  hasActiveFilters?: boolean; // dot表示用（初期値との差分で外側で判定）
  width?: number; // Popoverの横幅
};

export const UsersSearchButton: React.FC<UsersSearchButtonProps> = ({
  allUserRoles,
  value,
  onChange,
  hasActiveFilters = false,
  width = 420,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) setOpenDrawer(true);
    else setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDrawer(false);
  };

  return (
    <>
      <Tooltip title="検索条件">
        <IconButton
          sx={{ position: "absolute", right: 1 }}
          aria-label="検索条件"
          onClick={handleOpen}
        >
          <Badge variant="dot" color="primary" invisible={!hasActiveFilters}>
            <SearchIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* PC: Popover */}
      <Popover
        open={!!anchorEl && !isMobile}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: { p: 1, borderRadius: 2, width }, // ← 以前の PaperProps.sx をここへ
            // elevation: 0, variant: "outlined", // 細かい指定もここで
          },
        }}
      >
        <SearchList
          allUserRoles={allUserRoles}
          value={value}
          onChange={onChange}
          embedded
        />
      </Popover>

      {/* モバイル: ボトムシート */}
      <SwipeableDrawer
        anchor="bottom"
        open={openDrawer && isMobile}
        onOpen={() => setOpenDrawer(true)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "85vh",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <SearchList
            allUserRoles={allUserRoles}
            value={value}
            onChange={onChange}
            embedded
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button variant="contained" onClick={handleClose}>
              閉じる
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
};
