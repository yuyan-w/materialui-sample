export const AppRole = {
  Admin: "Admin",
  Editor: "Editor",
  Viewer: "Viewer",
} as const;

export type AppRoleType = (typeof AppRole)[keyof typeof AppRole];

export const isAdmin = (role: string): boolean => {
  return role === AppRole.Admin;
};
