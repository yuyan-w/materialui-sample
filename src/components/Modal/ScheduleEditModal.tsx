import { z } from "zod";
import { useEffect, useState } from "react";
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
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ja } from "date-fns/locale/ja";
import { ScheduleFormData } from "../pages/TimerPage";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import {
  ExternalServiceCode,
  getAvailableCleaningOptionTypes,
  getCleaningOptionChoices,
  getCleaningOptionTypeLabel,
} from "../pages/cleaningOptionType";

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  schedule: ScheduleFormData;
};

const scheduleSchema = z.object({
  name: z.string().min(1, "スケジュール名を入力してください"),
  day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
  time: z.date(),
  room: z.string().min(1, "部屋を選択してください"),
  note: z.string().optional(),
  cleaningOptions: z.record(z.string(), z.string()),
});

type ScheduleFormInput = z.infer<typeof scheduleSchema>;

export default function ScheduleEditModal({
  open,
  onClose,
  schedule,
}: ScheduleModalProps) {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ScheduleFormInput>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: schedule.name || "",
      day: "mon",
      time: new Date(),
      room: "",
      note: "",
      cleaningOptions: schedule.cleaningOptions.reduce((acc, cur) => {
        acc[cur.type] = cur.value;
        return acc;
      }, {} as Record<string, string>),
    },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchRoomOptions();
      setOptions(data);
      setLoading(false);
      setValue("room", schedule.room);
    })();
  }, [setValue, schedule.room]);

  const onSubmit = (data: ScheduleFormInput) => {
    console.log("送信データ:", data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>スケジュールを作成</DialogTitle>

        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)} id="schedule-form">
            <Stack spacing={2} mt={1}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="スケジュール名"
                    fullWidth
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel size="small">曜日</InputLabel>
                    <Select
                      {...field}
                      size="small"
                      label="曜日"
                      error={!!errors.day}
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
                )}
              />

              <Controller
                name="time"
                control={control}
                render={({ field, fieldState }) => (
                  <TimePicker
                    {...field}
                    label="実行時間"
                    ampm={false} // 24時間表記
                    minutesStep={5} // 5分刻み（任意で調整）
                    onChange={(val) => field.onChange(val)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="room"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel id="room-label">掃除する部屋</InputLabel>
                    <Select
                      {...field}
                      labelId="room-label"
                      label="掃除する部屋"
                      disabled={loading}
                      error={!!errors.room}
                    >
                      {options.length === 0 ? (
                        <MenuItem value="" disabled>
                          読み込み中...
                        </MenuItem>
                      ) : (
                        options.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.room && (
                      <Typography variant="caption" color="error">
                        {errors.room.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CleaningServicesIcon
                    sx={{ color: "text.secondary", fontSize: "20px" }}
                    fontSize="small"
                  />
                  <Typography variant="subtitle1">清掃設定</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {/** 清掃設定入力 */}

                {getAvailableCleaningOptionTypes(
                  schedule.code as ExternalServiceCode
                ).map((type) => {
                  const typeLabel = getCleaningOptionTypeLabel(type);
                  const options = getCleaningOptionChoices(
                    schedule.code as ExternalServiceCode,
                    type
                  );

                  return (
                    <Controller
                      key={type}
                      name={`cleaningOptions.${type}`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>{typeLabel}</InputLabel>
                          <Select {...field} label={typeLabel}>
                            {options.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  );
                })}

                <Divider />
              </Box>

              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="備考"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
            </Stack>
          </form>
        </DialogContent>

        <DialogActions>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose}>キャンセル</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="schedule-form"
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

type OptionItem = {
  label: string;
  value: string;
};

const fetchRoomOptions = async (): Promise<OptionItem[]> => {
  await new Promise((res) => setTimeout(res, 500)); // 擬似遅延
  return [
    { label: "リビング", value: "living" },
    { label: "寝室", value: "bedroom" },
    { label: "廊下", value: "hallway" },
  ];
};
