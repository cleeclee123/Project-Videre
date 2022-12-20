interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private storage_: T[] = [];
  private capacity_: number = Infinity;

  constructor(capacity: number) {
    this.capacity_ = capacity;
  }

  enqueue(item: T): void {
    if (this.size() === this.capacity_) {
      // throw Error("Queue has reached max capacity, you cannot add more items");
      console.log("At Capacity");
    }
    this.storage_.push(item);
  }

  dequeue(): T | undefined {
    return this.storage_.shift();
  }

  size(): number {
    return this.storage_.length;
  }

  getStorage(): Array<T> {
    return this.storage_;
  }

  getCapacity(): number {
    return this.capacity_;
  }
}
