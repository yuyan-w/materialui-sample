import { addDays, setHours, setMinutes, isAfter } from "date-fns";

type Schedule = {
  day: number; // 0 ~ 6
  time: string; // "HH:mm"
};

// 次に実行されるスケジュール（未来の中で一番早いやつ）
const getNextScheduleDatetime = (schedule: Schedule): Date => {
  const now = new Date();
  const [hour, minute] = schedule.time.split(":").map(Number);
  const daysUntilNext = (schedule.day + 7 - now.getDay()) % 7 || 7; // 同じ曜日でも時間が過ぎてたら来週

  const baseDate = addDays(now, daysUntilNext);
  const result = setMinutes(setHours(baseDate, hour), minute);

  return result;
};

const getUpcomingSchedule = <T extends Schedule>(
  schedules: T[]
): T | undefined => {
  if (schedules.length === 0) return undefined;

  const upcoming = schedules
    .map((s) => ({ ...s, datetime: getNextScheduleDatetime(s) }))
    .filter(({ datetime }) => isAfter(datetime, new Date()))
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  return upcoming[0]; // 一番近いやつ
};

// 一番最近実行されたスケジュール（過去の中で一番近いやつ）
const getPreviousScheduleDatetime = (schedule: Schedule): Date => {
  const now = new Date();
  const [hour, minute] = schedule.time.split(":").map(Number);
  const daysSinceLast = (now.getDay() + 7 - schedule.day) % 7 || 7;

  const baseDate = addDays(now, -daysSinceLast);
  const result = setMinutes(setHours(baseDate, hour), minute);

  return result;
};

const getPreviousSchedule = <T extends Schedule>(
  schedules: T[]
): T | undefined => {
  const previous = schedules
    .map((s) => ({ ...s, datetime: getPreviousScheduleDatetime(s) }))
    .filter(({ datetime }) => datetime < new Date())
    .sort((a, b) => b.datetime.getTime() - a.datetime.getTime());

  return previous[0]; // 最も直近の過去
};
