import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// 仮データ（APIから取得する想定）
const mockUser = {
  id: "12345",
  name: "山田 太郎",
  email: "yamada@example.com",
  avatarUrl: "https://i.pravatar.cc/150?u=12345",
  createdAt: "2024-01-01",
  role: "管理者",
};

const DetailPage = () => {
  const user = mockUser; // 実際は useQuery などで取得する

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        ✅ MUI v5 セットアップ完了
      </Typography>
      <Button variant="contained" color="primary">
        確認用ボタン
      </Button>
    </Container>
  );
};

export default DetailPage;
