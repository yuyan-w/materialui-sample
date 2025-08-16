export const UserRole = {
  admin: "ADMIN",
  member: "MEMBER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const UserRoles = Object.entries(UserRole).map(([_, value]) => value);

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "管理者",
  MEMBER: "一般",
};

export const parseUserRole = (role: string): UserRole | undefined => {
  const trimmed = role?.trim();
  if (!trimmed) return undefined;

  const VALUE_CANDIDATES = Object.values(UserRole) as readonly UserRole[]; // ["ADMIN","MEMBER"]
  const KEY_CANDIDATES = Object.keys(UserRole) as Array<keyof typeof UserRole>; // ["admin","member"]

  // 1) 値そのもの（"ADMIN" / "MEMBER"）
  if (VALUE_CANDIDATES.includes(trimmed as UserRole)) {
    return trimmed as UserRole;
  }

  // 2) 値の大小文字違い
  const upper = trimmed.toUpperCase();
  if (VALUE_CANDIDATES.includes(upper as UserRole)) {
    return upper as UserRole;
  }

  // 3) キー名（"admin" / "member"）→ 対応する値へ
  const lower = trimmed.toLowerCase();
  const hitKey = KEY_CANDIDATES.find((k) => k.toLowerCase() === lower);
  if (hitKey) {
    return UserRole[hitKey];
  }

  // 4) ラベル（"管理者" / "一般"）
  const labelToRole = new Map<string, UserRole>(
    Object.entries(USER_ROLE_LABELS).map(([value, label]) => [
      label,
      value as UserRole,
    ])
  );
  const fromLabel = labelToRole.get(trimmed);
  if (fromLabel) return fromLabel;

  // どれにも該当しなければ undefined
  return undefined;
};
