import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {NodeGraph} from "../../../utility/model/NodeGraph";
import {CdkDragMove} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-graph-presenter',
  templateUrl: './graph-presenter.component.html',
  styleUrls: ['./graph-presenter.component.scss']
})
export class GraphPresenterComponent implements OnInit {
  public dragNodePositionList: Array<any>;
  public nodeList: Array<NodeGraph>;

  public numberOfNode: number = 0;
  public matrix: number[][];

  @Output() createdMatrix = new EventEmitter<number[][]>();
  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  public sendMatrix() {
    this.createdMatrix.emit(this.matrix);
  }
  private init() {
    this.matrix = new Array<number[]>();
  }

  public addNode() {
    this.numberOfNode ++;
    let newRow = new Array<number>();
    for (let i=0; i<this.matrix.length; i++) {
      this.matrix[i].push(0);
      newRow.push(0)
    }
    newRow.push(1);
    this.matrix.push(newRow);
  }


  public toggleItem(x: number, y: number) {
    this.matrix[x][y] = this.matrix[x][y] == 0 ? 1:0;
    this.matrix[y][x] = this.matrix[x][y];
  }
}
