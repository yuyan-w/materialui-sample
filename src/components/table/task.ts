import { ulid } from "ulid";
import { TaskStatus, User } from "./type";
import { Task } from "./type";

// ステータスの候補
const STATUS_LIST: TaskStatus[] = ["todo", "in_progress", "done"];

/**
 * 過去30日以内のランダムな日時を返す
 */
function randomDateWithinLast30Days(): Date {
  const now = new Date();
  const past = new Date();
  const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // 最大30日分（ミリ秒）
  past.setTime(now.getTime() - offset);
  return past;
}

/**
 * ユーザーのダミーデータを生成する
 */
function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => {
    const id = ulid();
    return {
      id,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    };
  });
}

/**
 * タスクのダミーデータを生成
 * - 各ユーザーのタスク数は1〜maxTasksPerUserのランダム
 * - createdAtは過去30日以内
 * - 結果は createdAt の降順
 */
export function generateTasksWithUsers(
  userCount: number,
  maxTasksPerUser: number
): Task[] {
  const users = generateUsers(userCount);
  const tasks: Task[] = [];

  users.forEach((user) => {
    const taskCount = Math.floor(Math.random() * maxTasksPerUser) + 1;

    for (let i = 0; i < taskCount; i++) {
      const createdAt = randomDateWithinLast30Days();

      tasks.push({
        id: ulid(),
        title: `タスク ${i + 1}（${user.name}）`,
        description: `${user.name} による説明付きタスク`,
        status: STATUS_LIST[Math.floor(Math.random() * STATUS_LIST.length)],
        createdBy: user,
        createdAt: createdAt.toISOString(),
      });
    }
  });

  // createdAt 降順ソート
  return tasks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function convertTasksToTableRows(tasks: Task[]) {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    createdAt: new Date(task.createdAt).toLocaleString(), // 表示用に整形
    user: task.createdBy.name,
    email: task.createdBy.email,
  }));
}
