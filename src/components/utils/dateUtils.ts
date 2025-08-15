import {
  parseISO,
  format,
  isSameDay,
  isBefore,
  addDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";

/**
 * アプリ内で扱う日付型の共通型
 * - Date: 標準Date型
 * - string: ISO8601形式（例: '2024-05-01T10:00:00Z'）
 * - number: Unix timestamp（秒 or ミリ秒を自動判定）
 */
export type DateLike = Date | string | number;

/**
 * 任意の日付入力 (DateLike) を Date オブジェクトに変換
 * - Date → そのまま返却
 * - string → ISO8601形式とみなして parseISO で変換
 * - number → 桁数で秒 (10桁) / ミリ秒 (13桁) を自動判定し Date に変換
 *
 * @param input 日付入力（Date | ISO文字列 | Unix timestamp）
 * @returns Date オブジェクト
 */
export const toDate = (input: DateLike): Date => {
  if (input instanceof Date) return input;
  if (typeof input === "string") return parseISO(input);

  if (typeof input === "number") {
    return input.toString().length === 10
      ? new Date(input * 1000)
      : new Date(input);
  }

  throw new Error("Invalid date input");
};

/**
 * 日付を 'yyyy/MM/dd' (JST)形式でフォーマット
 * @param input 日付入力
 * @returns フォーマット済み文字列
 */
export const formatDateJST = (input: DateLike) => {
  const date = toDate(input);
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC->JST
  return format(jstDate, "yyyy/MM/dd");
};

/**
 * 日付を 'yyyy/MM/dd HH:mm' (JST)形式でフォーマット
 * @param input 日付入力
 * @returns フォーマット済み文字列
 */
export const formatDateTimeJST = (input: DateLike) => {
  const date = toDate(input);
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC->JST
  return format(jstDate, "yyyy/MM/dd HH:mm");
};

/**
 * 2つの日付が同じ日か判定（時分秒は無視し日単位で比較）
 * @param a 日付1
 * @param b 日付2
 * @returns true: 同日 / false: 異なる日
 */
export const isSameDate = (a: DateLike, b: DateLike) =>
  isSameDay(toDate(a), toDate(b));

/**
 * 指定日が現在日時より過去か判定
 * @param input 判定対象の日付
 * @returns true: 過去 / false: 現在以降
 */
export const isPastDate = (input: DateLike) =>
  isBefore(toDate(input), new Date());

/**
 * 指定日に指定日数を加算
 * @param input 基準日
 * @param days 加算日数（負数で減算も可能）
 * @returns 加算後の日付 (Date)
 */
export const addDaysToDate = (input: DateLike, days: number) =>
  addDays(toDate(input), days);

/**
 * 指定日の月初 (1日 00:00) を取得
 * @param input 基準日
 * @returns 月初の Date
 */
export const getStartOfMonth = (input: DateLike) => startOfMonth(toDate(input));

/**
 * 指定日の月末 (最終日 23:59:59) を取得
 * @param input 基準日
 * @returns 月末の Date
 */
export const getEndOfMonth = (input: DateLike) => endOfMonth(toDate(input));

/**
 * 指定日を Unix timestamp (ミリ秒単位) に変換
 * @param input 日付入力
 * @returns Unix timestamp（ミリ秒単位）
 */
export const toUnixMillis = (input: DateLike) => toDate(input).getTime();

/**
 * 指定日を Unix timestamp (秒単位) に変換
 * @param input 日付入力
 * @returns Unix timestamp（秒単位）
 */
export const toUnixSeconds = (input: DateLike) =>
  Math.floor(toDate(input).getTime() / 1000);
