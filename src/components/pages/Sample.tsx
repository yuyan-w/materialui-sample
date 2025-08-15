import { Container, TextField, Typography } from "@mui/material";
import React from "react";

const RequiredLabel = ({ label }: { label: string }) => (
  <>
    {label} <span style={{ color: "red" }}>*</span>
  </>
);

const Sample = () => {
  return (
    <Container sx={{ py: 2 }} maxWidth="sm">
      <div>
        Sample
        <TextField
          label="ユーザーID"
          required
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "red", // ← アスタリスクだけ色を変更
            },
          }}
        />
      </div>
    </Container>
  );
};

export default Sample;
