import {Component, Input, OnInit} from '@angular/core';
import {NodeGraph} from "../../model/NodeGraph";
import {CdkDragMove} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-node-graph',
  templateUrl: './node-graph.component.html',
  styleUrls: ['./node-graph.component.scss']
})
export class NodeGraphComponent implements OnInit {

  @Input() node: NodeGraph;
  public dragNodePosition;

  constructor() {
    this.dragNodePosition = {x: 0, y: 0};
  }

  ngOnInit(): void {
    this.initPosition();
  }

  private initPosition() {
    this.dragNodePosition = {x: this.node.xPosition, y: this.node.yPosition};
  }

  dragMoved(event: CdkDragMove) {
    this.node.xPosition = event.pointerPosition.x;
    this.node.yPosition = event.pointerPosition.y;
    this.changePositionNode();
  }

  public changePositionNode() {
    this.node.resetNodePosition(this.node.xPosition, this.node.yPosition);
  }
}
