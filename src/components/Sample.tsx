import { Button, Stack, Typography } from "@mui/material";

export const Sample = () => {
  return (
    <div>
      <Button>Button</Button>
      <Stack spacing={1}>
        <Typography>サンプル</Typography>
        <Typography variant="tableHeader">ヘッダー名</Typography>
        <Typography variant="tableBody">データ</Typography>
      </Stack>
    </div>
  );
};
