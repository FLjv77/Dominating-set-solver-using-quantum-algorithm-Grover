import {EventEmitter} from "@angular/core";

export class NodeGraph {
  index: number;
  value: number;
  adjacentNode: NodeGraph[];
  xPositionHandler: EventEmitter<number>;
  yPositionHandler: EventEmitter<number>;
  xPosition: number;
  yPosition: number;

  constructor(index: number, value: number) {
    this.index = index;
    this.value = value;
    this.adjacentNode = new Array<NodeGraph>();
    this.xPosition = 200 + this.index * 70;
    this.yPosition = 50;

    this.xPositionHandler = new EventEmitter<number>();
    this.yPositionHandler = new EventEmitter<number>();

    this.setInitializePositionNode();
  }

  setInitializePositionNode() {
    this.yPositionHandler.emit(this.yPosition);
    this.xPositionHandler.emit(this.xPosition);
  }

  resetNodePosition(x: number, y: number) {
    this.yPosition = y;
    this.xPosition = x;
    this.xPositionHandler.emit(x);
    this.yPositionHandler.emit(y);
  }

  addNewAdjacent(node: NodeGraph) {
    this.adjacentNode ? this.adjacentNode.push(node) : this.adjacentNode = [node];
  }
}
