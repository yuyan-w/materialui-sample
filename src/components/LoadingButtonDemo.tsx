import React, { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoginIcon from "@mui/icons-material/Login";

const ActionButton: React.FC<{
  label: string;
  Icon: React.ReactNode;
}> = ({ label, Icon }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <Button
      variant="contained"
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : Icon
      }
      onClick={handleClick}
      disabled={loading}
    >
      {label}
    </Button>
  );
};

export const ButtonLoadingDemo: React.FC = () => {
  return (
    <Stack spacing={2} p={2} alignItems="flex-start">
      <Typography variant="h6">CRUD + ログイン ボタンデモ</Typography>

      <ActionButton label="作成" Icon={<AddIcon />} />
      <ActionButton label="表示" Icon={<VisibilityIcon />} />
      <ActionButton label="編集" Icon={<EditIcon />} />
      <ActionButton label="削除" Icon={<DeleteIcon />} />
      <ActionButton label="ログイン" Icon={<LoginIcon />} />
    </Stack>
  );
};

export default ButtonLoadingDemo;
