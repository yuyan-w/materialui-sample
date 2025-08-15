// baseQueue.ts

export type QueueItem<T> = {
  id: string;
  data: T;
};

export class BaseQueue<T> {
  private queue: QueueItem<T>[] = [];

  enqueue(item: QueueItem<T>): void {
    this.queue.push(item);
  }

  getAllItems(): QueueItem<T>[] {
    return this.queue;
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

// rdsQueue.ts

// import { BaseQueue } from './baseQueue';

type RdsRecord = {
  name: string;
  age: number;
};

export const rdsQueue = new BaseQueue<RdsRecord>();

export const initialQueue = () => {
  rdsQueue.clear();
};

// import { rdsQueue } from './rdsQueue';

rdsQueue.enqueue({
  id: "user-1",
  data: {
    name: "Taro",
    age: 25,
  },
});

const payload = rdsQueue.getAllItems();
