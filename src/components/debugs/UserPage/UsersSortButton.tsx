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
import SortIcon from "@mui/icons-material/Sort";
import { UsersSort } from "./sort";
import { UsersSortControl } from "./UserSortControl";

type UsersSortButtonProps = {
  value: UsersSort;
  onChange: (s: UsersSort) => void;
  hasActiveSort?: boolean;
  width?: number; // Popoverの横幅
};

export const UsersSortButton: React.FC<UsersSortButtonProps> = ({
  value,
  onChange,
  hasActiveSort = false,
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
          sx={{ position: "absolute", right: "48px" }}
          aria-label="検索条件"
          onClick={handleOpen}
        >
          <Badge variant="dot" color="primary" invisible={!hasActiveSort}>
            <SortIcon />
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
        <UsersSortControl value={value} onChange={onChange} />
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
          <UsersSortControl value={value} onChange={onChange} />
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
