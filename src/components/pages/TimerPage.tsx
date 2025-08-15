import {
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Container,
  CardActions,
} from "@mui/material";
import ScheduleModal from "../Modal/ScheduleFormModal";
import { useModal } from "../../hooks/useModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import {
  format,
  addDays,
  isAfter,
  setHours,
  setMinutes,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale/ja";
import { useState } from "react";
import ScheduleEditModal from "../Modal/ScheduleEditModal";
import AddIcon from "@mui/icons-material/Add";
import {
  type ExternalServiceCode,
  getCleaningOptionTypeLabel,
  getCleaningOptionValueLabel,
  parseCleaningOptionType,
} from "./cleaningOptionType";

const ExternalServiceCode = {
  Panasonic: "panasonic",
  Dyson: "dyson",
} as const;

type CleaningSetting = {
  type: string;
  value: string; // 実際の選択値（例: 強）
};

export type ScheduleFormData = {
  name: string;
  day: string; // "mon" | "tue"
  time: string; // "08:00" のような形式に変更！
  room: string;
  memo: string;
  cleaningOptions: CleaningSetting[];
  code: string;
};

// 表示用：曜日コード → 日本語
const dayMap: Record<string, string> = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
  sun: "日",
};

const schedules: ScheduleFormData[] = [
  {
    name: "朝の掃除",
    day: "mon",
    time: "08:00",
    room: "リビング",
    memo: "出勤前に掃除",
    cleaningOptions: [
      { type: "cleanMode", value: "normal" },
      { type: "workingMode", value: "on" },
    ],
    code: ExternalServiceCode.Panasonic,
  },
  {
    name: "夜の掃除",
    day: "wed",
    time: "20:30",
    room: "寝室",
    memo: "",
    cleaningOptions: [
      { type: "silentMode", value: "on" },
      { type: "uvSterilize", value: "true" },
      { type: "autoReturn", value: "true" },
    ],
    code: ExternalServiceCode.Dyson,
  },
];

const TimerPage = () => {
  const modal = useModal();
  const editModal = useModal();
  const [selectedSchedule, setSelectedSchedule] = useState<
    ScheduleFormData | undefined
  >(undefined);

  const upcoming = getThisWeekRuns(schedules);

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5">今週のスケジュール</Typography>
            <Card variant="outlined">
              <CardContent>
                {upcoming.map((run, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    {format(run.datetime, "MM/dd (EEE) HH:mm", { locale: ja })}{" "}
                    {run.schedule.room}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h5">スケジュール一覧</Typography>

              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={modal.handleOpen}
                size="small"
              >
                追加
              </Button>
            </Box>

            <Stack spacing={1}>
              {!schedules.length ? (
                <Card variant="outlined">
                  <CardContent sx={{ position: "relative" }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                    >
                      <Typography variant="h6" gutterBottom>
                        スケジュールがありません
                      </Typography>
                      <Button variant="contained" onClick={modal.handleOpen}>
                        スケジュールを追加する
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                schedules.map((schedule, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ position: "relative" }}>
                      <Box>
                        <Typography variant="h4">{`${dayMap[schedule.day]} ${
                          schedule.time
                        }`}</Typography>

                        <Typography variant="h6">{schedule.room}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {schedule.name}
                        </Typography>
                      </Box>
                      <Box mt={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CleaningServicesIcon
                            sx={{ color: "text.secondary", fontSize: "20px" }}
                            fontSize="small"
                          />
                          <Typography variant="subtitle2">清掃設定</Typography>
                        </Box>
                        <Box>
                          {schedule.cleaningOptions.map((opt, i) => {
                            const labels = getCleaningOptionDisplayLabels({
                              code: schedule.code,
                              type: opt.type,
                              value: opt.value,
                            });

                            return (
                              <Typography
                                key={i}
                                variant="body2"
                                color="text.secondary"
                              >
                                {labels.type}：{labels.value}
                              </Typography>
                            );
                          })}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => {}}
                          startIcon={<DeleteIcon />}
                        >
                          削除
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            editModal.handleOpen();
                          }}
                          startIcon={<EditIcon />}
                        >
                          編集
                        </Button>
                      </Stack>
                    </CardActions>
                  </Card>
                ))
              )}
            </Stack>
          </Box>
        </Stack>
      </Container>
      <ScheduleModal open={modal.open} onClose={modal.handleClose} />
      {selectedSchedule && (
        <ScheduleEditModal
          open={editModal.open}
          onClose={() => {
            editModal.handleClose();
            setSelectedSchedule(undefined);
          }}
          schedule={selectedSchedule}
        />
      )}
    </div>
  );
};

// ----------------------------------------
// ローカル関数
// ----------------------------------------

type DisplayLabel = {
  type: string;
  value: string;
};

const getCleaningOptionDisplayLabels = ({
  code,
  type,
  value,
}: {
  code: string;
  type: string;
  value: string;
}): DisplayLabel => {
  const invalidLabel: DisplayLabel = { type: "不明", value: "-" };
  const parsedType = parseCleaningOptionType(type);
  if (!parsedType) return invalidLabel;

  const typeLabel = getCleaningOptionTypeLabel(parsedType);

  const parsedCode = code as ExternalServiceCode;

  const valueLabel = getCleaningOptionValueLabel(parsedCode, parsedType, value);
  return { type: typeLabel, value: valueLabel };
};

const dayToIndex: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const getThisWeekRuns = (schedules: ScheduleFormData[]) => {
  const runs: { datetime: Date; schedule: ScheduleFormData }[] = [];

  // 今週の日曜（または月曜スタートにしたい場合は引数調整）
  const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // 0: Sunday

  // 今週1週間（日〜土）をループ
  for (let offset = 0; offset < 7; offset++) {
    const date = addDays(start, offset);
    const day = date.getDay(); // 0〜6

    for (const schedule of schedules) {
      if (dayToIndex[schedule.day] === day) {
        const [hour, minute] = schedule.time.split(":").map(Number);
        const datetime = setMinutes(setHours(date, hour), minute);
        runs.push({ datetime, schedule });
      }
    }
  }

  // 日時順にソートして返す
  return runs.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
};
export default TimerPage;
