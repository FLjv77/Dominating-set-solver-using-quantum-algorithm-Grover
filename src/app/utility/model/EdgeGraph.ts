import {NodeGraph} from "./NodeGraph";

export class EdgeGraph {
  weight: number;
  nodeStart: NodeGraph;
  endNode: NodeGraph;

  constructor(weight: number, start: NodeGraph, end: NodeGraph) {
    this.nodeStart = start;
    this.endNode = end;
    this.weight = weight;
  }
}
