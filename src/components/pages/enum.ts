// constants/actionType.ts

import { z } from "zod";

const ActionType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;

// 型として使う場合
type ActionType = (typeof ActionType)[keyof typeof ActionType];

// zodスキーマ
// ループを使って作成する方法は今は難しいかも？
const ActionTypeSchema = z.union([
  z.literal(ActionType.CREATE),
  z.literal(ActionType.UPDATE),
  z.literal(ActionType.DELETE),
]);

// ActionTypeと同じ
type ZodActionType = z.infer<typeof ActionTypeSchema>;

// 1. 文字列 → ActionType への変換関数
const parseActionType = (value: string): ActionType | undefined => {
  const values = Object.values(ActionType);
  return values.includes(value as ActionType)
    ? (value as ActionType)
    : undefined;
};

// 2. ActionType との比較関数
export const isActionType = (value: string): value is ActionType => {
  return Object.values(ActionType).includes(value as ActionType);
};

// すべての ActionType を列挙（UI表示や select 用）
export const actionTypeList: ActionType[] = Object.values(ActionType);

// ラベルをつけたい
export const getActionTypeLabel = (type: ActionType): string => {
  switch (type) {
    case ActionType.CREATE:
      return "作成";
    case ActionType.UPDATE:
      return "更新";
    case ActionType.DELETE:
      return "削除";
    default:
      return "不明";
  }
};

const main = () => {
  const str = getData();
  // 比較はそのままで良い
  if (str === ActionType.CREATE) {
    console.log("yesa");
  }
};

const getData = () => {
  const result = "create";
  return result;
};
