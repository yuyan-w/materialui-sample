export type Task = {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  dueDate: string; // ISO形式で
};

const statuses: Task["status"][] = ["todo", "in_progress", "done"];

export const tasks: Task[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  const status = statuses[i % statuses.length];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (i % 15)); // 今から最大14日後

  return {
    id,
    title: `タスク ${id}`,
    description: `これはタスク ${id} の詳細説明です。`,
    status,
    dueDate: dueDate.toISOString().split("T")[0], // YYYY-MM-DD形式
  };
});
