import { Graph } from "./Graph";

function comparator(a: number, b: number): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function printGraph(graph: Graph<any>) {
  let keys = graph.nodes.keys();
  for (let i of keys) {
    let values = graph.nodes.get(i);
    if (values != undefined || values != null) {
      console.log({"n": i, "al": values.adjacent.map(x => x.data)});
    } else {
      console.log("null value");
    }
  }
}