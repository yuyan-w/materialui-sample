import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Typography,
  DialogContentText,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ja } from "date-fns/locale/ja";

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ScheduleModal({ open, onClose }: ScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>スケジュールを作成</DialogTitle>

        <DialogContent dividers>
          <DialogContentText>
            清掃ロボットの清掃スケジュールを設定します。
          </DialogContentText>
          <Stack spacing={2} mt={1}>
            <TextField label="スケジュール名" fullWidth />

            <FormControl fullWidth>
              <InputLabel>曜日</InputLabel>
              <Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                label="曜日"
              >
                <MenuItem value="mon">月</MenuItem>
                <MenuItem value="tue">火</MenuItem>
                <MenuItem value="wed">水</MenuItem>
                <MenuItem value="thu">木</MenuItem>
                <MenuItem value="fri">金</MenuItem>
                <MenuItem value="sat">土</MenuItem>
                <MenuItem value="sun">日</MenuItem>
              </Select>
            </FormControl>

            <TimePicker label="実行時間" />

            <FormControl fullWidth>
              <InputLabel>掃除する部屋</InputLabel>
              <Select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                label="掃除する部屋"
              >
                <MenuItem value="リビング">リビング</MenuItem>
                <MenuItem value="寝室">寝室</MenuItem>
                <MenuItem value="廊下">廊下</MenuItem>
                <MenuItem value="キッチン">キッチン</MenuItem>
              </Select>
            </FormControl>

            <TextField label="備考" multiline rows={3} fullWidth />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
