import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import {
  formatDate,
  formatDateTime,
  isSameDate,
  isPastDate,
  addDaysToDate,
  getStartOfMonth,
  getEndOfMonth,
  toUnixMillis,
  toUnixSeconds,
} from "./utils/dateUtils";

const sampleDateISO = "2024-05-01T10:00:00Z";
const sampleDateUnixSeconds = 1714557600; // 2024-05-01 10:00:00 UTC
const sampleDateUnixMillis = 1714557600000; // 2024-05-01 10:00:00 UTC

const DateView = () => {
  const now = new Date();

  return (
    <Card sx={{ p: 2, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6">📅 Date-fns 表記サンプル</Typography>
        <Stack spacing={2} mt={2}>
          <Typography>▶ ISO文字列：{formatDateTime(sampleDateISO)}</Typography>
          <Typography>
            ▶ Unix秒：{formatDateTime(sampleDateUnixSeconds)}
          </Typography>
          <Typography>
            ▶ Unixミリ秒：{formatDateTime(sampleDateUnixMillis)}
          </Typography>

          <Typography>
            ▶ isSameDate(今日, ISO):{" "}
            {isSameDate(now, sampleDateISO) ? "同じ" : "違う"}
          </Typography>
          <Typography>
            ▶ isPastDate(ISO): {isPastDate(sampleDateISO) ? "過去" : "未来"}
          </Typography>

          <Typography>
            ▶ 3日後(ISO): {formatDateTime(addDaysToDate(sampleDateISO, 3))}
          </Typography>
          <Typography>
            ▶ 月初(ISO): {formatDate(getStartOfMonth(sampleDateISO))}
          </Typography>
          <Typography>
            ▶ 月末(ISO): {formatDate(getEndOfMonth(sampleDateISO))}
          </Typography>

          <Typography>
            ▶ Unix秒に変換(ISO): {toUnixSeconds(sampleDateISO)}
          </Typography>
          <Typography>
            ▶ Unixミリ秒に変換(ISO): {toUnixMillis(sampleDateISO)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DateView;
