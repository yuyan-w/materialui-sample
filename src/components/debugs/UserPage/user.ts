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

// ---- モック生成ユーティリティ ----

type MakeUsersOptions = {
  seed?: number; // 乱数の種（同じseedなら同じ結果）
  domain?: string; // メールドメイン
  adminRatio?: number; // ADMINの比率（0..1）
  ensureAtLeastOneAdmin?: boolean; // 先頭をADMINに固定
  startIndex?: number; // 連番オフセット
};

type ListUsersMockOptions = MakeUsersOptions & {
  delayMs?: number; // 疑似API待ち時間
  signal?: AbortSignal; // 中断用（AbortController.signal）
};

// 軽量な疑似乱数（再現性のため）
function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hex8(rand: () => number) {
  return Math.floor(rand() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
}

// 同期：配列を作るだけ（Promise不要）
export function makeUsers(
  count: number,
  {
    seed = 123,
    domain = "example.com",
    adminRatio = 0.2,
    ensureAtLeastOneAdmin = true,
    startIndex = 1,
  }: MakeUsersOptions = {}
): User[] {
  const rand = mulberry32(seed);

  const first = [
    "Taro",
    "Hanako",
    "Sora",
    "Ren",
    "Aoi",
    "Yui",
    "Haruto",
    "Yuna",
    "Kaito",
    "Mio",
  ];
  const last = [
    "Watanabe",
    "Sato",
    "Suzuki",
    "Takahashi",
    "Tanaka",
    "Ito",
    "Yamamoto",
    "Nakamura",
    "Kobayashi",
    "Kato",
  ];

  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const f = first[Math.floor(rand() * first.length)];
    const l = last[Math.floor(rand() * last.length)];
    const name = `${l} ${f}`;
    const handle = `${(f + "." + l).toLowerCase()}${i + startIndex}`.replace(
      /\s/g,
      ""
    );
    const email = `${handle}@${domain}`;
    const id = `usr_${hex8(rand)}${hex8(rand)}`;

    // 役割の割り当て
    let role: User["role"] =
      rand() < adminRatio ? UserRole.admin : UserRole.member;
    if (ensureAtLeastOneAdmin && i === 0) role = UserRole.admin;

    users.push({ id, name, email, role });
  }
  return users;
}

// 疑似API：遅延とAbortに対応（React側からsignalを渡せる）
export async function listUsersMock(
  count: number,
  { delayMs = 300, signal, ...opts }: ListUsersMockOptions = {}
): Promise<User[]> {
  // すでに中断されていたら即エラー
  signal?.throwIfAborted();

  // 疑似遅延
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, delayMs);
    if (!signal) return;
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });

  return makeUsers(count, opts);
}
