import * as React from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  type ChipProps,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { User, USER_ROLE_LABELS } from "./user";

type Cols = { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };

interface UserCardListProps {
  users: User[];
  dense?: boolean; // 余白を詰める
  columns?: Cols; // 列数を画面幅ごとに指定（例: { md: 3, lg: 4 }）
  onCardClick?: (user: User) => void; // カードクリック
  renderActions?: (user: User) => React.ReactNode; // 右下に任意アクションを追加
}

const toSpan = (cols?: number) =>
  cols ? Math.max(1, Math.min(12, Math.round(12 / cols))) : undefined;

// 名前から頭文字を作る簡易関数
function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "").toUpperCase();
}

export const UsersList: React.FC<UserCardListProps> = ({
  users,
  dense = false,
  columns = { xs: 1, sm: 2, md: 2, lg: 2 },
  onCardClick,
  renderActions,
}) => {
  const handleCopy = (email: string) => {
    if (navigator.clipboard)
      navigator.clipboard.writeText(email).catch(() => {});
  };

  if (!users || users.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">ユーザーがいません</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {users.map((u) => {
        const roleLabel = USER_ROLE_LABELS[u.role];
        const roleColor: ChipProps["color"] =
          u.role === "ADMIN" ? "error" : "default";

        return (
          <Grid
            key={u.id}
            item
            xs={toSpan(columns.xs) ?? 12}
            sm={toSpan(columns.sm) ?? 6}
            md={toSpan(columns.md) ?? 4}
            lg={toSpan(columns.lg) ?? 3}
            xl={toSpan(columns.xl) ?? 3}
          >
            <Card
              variant="outlined"
              onClick={() => onCardClick?.(u)}
              sx={{
                height: "100%",
                cursor: onCardClick ? "pointer" : "default",
                "&:hover": onCardClick ? { boxShadow: 3 } : undefined,
              }}
            >
              <CardHeader
                avatar={<Avatar>{initials(u.name)}</Avatar>}
                title={
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {u.name}
                  </Typography>
                }
                subheader={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {u.email}
                    </Typography>
                    <Tooltip title="メールをコピー">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(u.email);
                        }}
                      >
                        <ContentCopyIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{ pb: dense ? 0 : 1.5 }}
              />

              <CardContent sx={{ pt: dense ? 1 : 2, pb: dense ? 1 : 2 }}>
                <Chip
                  size={dense ? "small" : "medium"}
                  label={roleLabel}
                  color={roleColor}
                  variant={u.role === "ADMIN" ? "filled" : "outlined"}
                />
              </CardContent>

              {(renderActions || onCardClick) && (
                <CardActions
                  sx={{
                    pt: 0,
                    pb: dense ? 1 : 2,
                    px: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  {renderActions?.(u)}
                </CardActions>
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
