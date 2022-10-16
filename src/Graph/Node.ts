/**
 * Node class
 */
export class Node<T> {
  data: T;
  adjacent: Node<T>[];
  comparator: (a: T, b: T) => number;

  // comparator is needed due to templates
  // constructor contains the comparator function to account for necessary methods when constructing a graph data structure
  constructor(data: T, comparator: (a: T, b: T) => number) {
    this.data = data;
    this.adjacent = [];
    this.comparator = comparator;
  }

  addAdjacent(node: Node<T>): void {
    this.adjacent.push(node);
  }

  removeAdjacent(data: T): Node<T> | null {
    const index = this.adjacent.findIndex(
      (node) => this.comparator(node.data, data) === 0
    );

    if (index > -1) {
      return this.adjacent.splice(index, 1)[0];
    }
    return null;
  }
}
