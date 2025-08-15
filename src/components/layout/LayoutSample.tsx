import React from "react";
import { AppBar, Box, Toolbar, Typography, Container } from "@mui/material";

const Header = () => (
  <AppBar position="fixed">
    <Toolbar>
      <Typography variant="h6" component="div">
        ヘッダー
      </Typography>
    </Toolbar>
  </AppBar>
);

const Footer = () => (
  <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
    <Toolbar>
      <Typography variant="body2" sx={{ flexGrow: 1, textAlign: "center" }}>
        フッター
      </Typography>
    </Toolbar>
  </AppBar>
);

const App = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Toolbar /> {/* ヘッダーの高さ分だけ空ける */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          メインコンテンツ
        </Typography>
        <Typography>
          ここにページの内容が入ります。スクロールしてもヘッダーとフッターは固定です。
        </Typography>
        <Box sx={{ bgcolor: "gray", width: "200px", height: "1500px" }}>
          sample
        </Box>
        <Typography>ここで終わり</Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default App;
