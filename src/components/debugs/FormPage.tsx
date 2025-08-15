import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import LongTextTypography from "./LongTextTypography";

interface RobotCardProps {
  robotName: string;
  robotImage: string;
  status: string;
  lastCleaned: string;
  onClick: () => void;
}

const RobotCard: React.FC<RobotCardProps> = ({
  robotName,
  robotImage,
  status,
  lastCleaned,
  onClick,
}) => {
  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={robotImage}
        alt={`${robotName} image`}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {robotName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ステータス: {status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          最後の清掃: {lastCleaned}
        </Typography>
        <Button size="small" onClick={onClick}>
          詳細
        </Button>
      </CardContent>
    </Card>
  );
};

const FormPage = () => {
  const robots = [
    {
      name: "ロボットA",
      image: "https://example.com/robotA.jpg",
      status: "作動中",
      lastCleaned: "2025/08/10",
    },
    {
      name: "ロボットB",
      image: "https://example.com/robotB.jpg",
      status: "充電中",
      lastCleaned: "2025/08/08",
    },
  ];

  const handleClick = (robotName: string) => {
    console.log(`${robotName}の詳細が表示されました。`);
  };

  return (
    <Box maxWidth={200}>
      <LongTextTypography>
        これはとても長いテキストです。これはとても長いテキストです。これはとても長いテキストです。これはとても長いテキストです。
      </LongTextTypography>
    </Box>
  );
};

export default FormPage;
