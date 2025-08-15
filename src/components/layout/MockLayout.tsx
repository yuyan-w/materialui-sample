import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
};

const MockLayout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 4,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            maxWidth: 960,
          }}
        >
          <Paper elevation={3} sx={{ p: 4 }}>
            {title && (
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
            )}
            {children}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default MockLayout;
