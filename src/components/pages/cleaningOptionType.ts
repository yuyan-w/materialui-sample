// src/constants/cleaningOptionTypes.ts
const ExternalServiceCode = {
  Panasonic: "panasonic",
  Dyson: "dyson",
} as const;

export type ExternalServiceCode =
  (typeof ExternalServiceCode)[keyof typeof ExternalServiceCode];

// 清掃設定のタイプ。各社共通
export const CleaningOptionType = {
  CleanMode: "cleanMode",
  WorkingMode: "workingMode",
  SilentMode: "silentMode",
  UVSterilize: "uvSterilize",
  AutoReturn: "autoReturn",
} as const;

// 文字列を清掃結果のタイプに変換。不正なら undefined
export const parseCleaningOptionType = (
  value: string
): CleaningOptionType | undefined => {
  const values = Object.values(CleaningOptionType);
  return values.includes(value as CleaningOptionType)
    ? (value as CleaningOptionType)
    : undefined;
};

// 清掃設定のタイプを表示ラベルのマップ
export const cleaningOptionTypeLabels: Record<CleaningOptionType, string> = {
  cleanMode: "吸引レベル",
  workingMode: "水拭き",
  silentMode: "静音モード",
  uvSterilize: "UV除菌",
  autoReturn: "自動帰還",
};

// 清掃結果のタイプのタイプ
type CleaningOptionType =
  (typeof CleaningOptionType)[keyof typeof CleaningOptionType];

// Select用アイテム
type OptionItem = {
  value: string;
  label: string;
};

// volumeのように値トラベルが同じやつ
const volumeOptions: OptionItem[] = Array.from({ length: 10 }, (_, i) => {
  const value = (i + 1).toString();
  return { value, label: value };
});

// 各社のラベル
export const cleaningOptionOptionsMap: Record<
  ExternalServiceCode,
  Partial<Record<CleaningOptionType, OptionItem[]>>
> = {
  panasonic: {
    cleanMode: [
      { value: "quiet", label: "静音" },
      { value: "normal", label: "標準" },
      { value: "strong", label: "強力" },
    ],
    workingMode: [
      { value: "on", label: "あり" },
      { value: "off", label: "なし" },
    ],
  },
  dyson: {
    silentMode: [
      { value: "on", label: "オン" },
      { value: "off", label: "オフ" },
    ],
    uvSterilize: [
      { value: "true", label: "あり" },
      { value: "false", label: "なし" },
    ],
    autoReturn: [
      { value: "true", label: "あり" },
      { value: "false", label: "なし" },
    ],
  },
};

/**
 * 指定された type と value に対応する表示用ラベルを取得する
 */
export const getCleaningOptionValueLabel = (
  code: ExternalServiceCode,
  type: CleaningOptionType,
  value: string
): string => {
  const options = cleaningOptionOptionsMap[code]?.[type] ?? [];
  return options.find((opt) => opt.value === value)?.label ?? value;
};

/**
 * 指定された type に対応する表示用ラベルを取得する
 */
export const getCleaningOptionTypeLabel = (
  type: CleaningOptionType
): string => {
  return cleaningOptionTypeLabels[type] ?? type;
};

/**
 * 指定された type に対応する選択肢一覧を取得する
 */
export const getCleaningOptionChoices = (
  code: ExternalServiceCode,
  type: CleaningOptionType
): OptionItem[] => {
  return cleaningOptionOptionsMap[code]?.[type] ?? [];
};

// 指定されたコードからオプションタイプを取得
export const getAvailableCleaningOptionTypes = (
  code: ExternalServiceCode
): CleaningOptionType[] => {
  return Object.keys(
    cleaningOptionOptionsMap[code] ?? []
  ) as CleaningOptionType[];
};
