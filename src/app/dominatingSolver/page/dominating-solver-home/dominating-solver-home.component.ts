import {Component, OnInit } from '@angular/core';
import {SATProducerFromAdjacencyMatrixService} from "../../service/SATProducerFromAdjacencyMatrix/satproducer-from-adjacency-matrix.service";
import {ControlQubitDataBaseService} from "../../service/controlQubitDataBase/control-qubit-data-base.service";
import {BinaryConverterNumberService} from "../../../common/service/binaryConverterNumberService/binary-converter-number.service";
import {SchoningSolverService} from "../../service/schoningSolver/schoning-solver.service";
import {GroverSolverService} from "../../service/groverSolver/grover-solver.service";
import {EChartsOption} from "echarts/types/dist/echarts";
import {PureStateQubit} from "../../model/PureStateQubit";
import {OrderListOfPureStateQubitService} from "../../../common/service/orderListOfPureStateQubit/order-list-of-pure-state-qubit.service";
import {NodeGraph} from "../../../utility/model/NodeGraph";

@Component({
  selector: 'app-dominating-solver-home',
  templateUrl: './dominating-solver-home.component.html',
  styleUrls: ['./dominating-solver-home.component.scss']
})
export class DominatingSolverHomeComponent implements OnInit {

  public node: NodeGraph;
  private satSetOfAdjacencyMatrix: number[][] = [];
  public tenTopAnswerList: PureStateQubit[][] = [];
  private adjacencyMatrix: number[][] = [];
  private maxLengthAnswer: number = 0;
  public chartOptionList: EChartsOption[] = [{}];

  constructor(private satProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService,
              private controlQubitDataBaseService: ControlQubitDataBaseService,
              private binaryConverterNumberService: BinaryConverterNumberService,
              private orderListOfPureStateQubitService: OrderListOfPureStateQubitService,
              private schoningSolverService: SchoningSolverService,
              private groverSolverService: GroverSolverService) {

    this.node = new NodeGraph(0, 0);
  }

  ngOnInit(): void {
/*    let c = document.getElementById("myCanvas");
    // @ts-ignore
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(300, 150);
    ctx.stroke();*/


/*    this.createAdjacencyMatrix();
    this.creatSatFromAdjacencyMatrix();
    this.setMaxLengthAnswer(4);
    this.runIterativeLimitationOnGrover();*/
  }


  public runAlgorithm(matrix: number[][]) {
    this.createAdjacencyMatrix(matrix);
    this.creatSatFromAdjacencyMatrix();
    this.setMaxLengthAnswer(3);
    this.runIterativeLimitationOnGrover();
  }

  private createAdjacencyMatrix(matrix: number[][]) {
/*    this.adjacencyMatrix =
    [
      [1,0,0,1,1,0,0,0,1,0],
      [0,1,1,0,0,1,1,0,0,0],
      [0,1,1,0,1,1,0,1,0,0],
      [1,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,1,0,0,0,0],
      [0,1,1,0,1,1,0,1,1,0],
      [0,1,0,0,0,0,1,1,0,0],
      [0,0,1,1,0,1,1,1,0,0],
      [1,0,0,0,0,1,0,0,1,0],
      [0,0,0,1,0,0,0,0,0,1]
    ];*/

    this.adjacencyMatrix = matrix;
  }

  private creatSatFromAdjacencyMatrix() {
    this.satSetOfAdjacencyMatrix = new Array<number[]>();
    this.satSetOfAdjacencyMatrix = this.satProducerFromAdjacencyMatrixService.getSatClose(this.adjacencyMatrix);
  }

  private getOrderNewGroverSolution(): number {
    let level =this.satProducerFromAdjacencyMatrixService.getSatLevel(this.satSetOfAdjacencyMatrix);
    return Math.floor(this.groverSolverService.getMaxOrderGroverWithSchoning(this.adjacencyMatrix.length, level));
  }

  private setMaxLengthAnswer(length: number) {
    this.maxLengthAnswer = length;
  }

  private checkTotalProbabilityIsValid(probability: number): boolean {
    return probability > 0.9 && probability < 1.1;
  }

  private runIterativeLimitationOnGrover() {
    for (let i=1; i <= this.maxLengthAnswer; i++) {
    }
    this.runGroverAlgorithmWithSchoning(this.maxLengthAnswer);
  }

  private runGroverAlgorithmWithSchoning(maxLengthAnswer: number) {
    let order = this.getOrderNewGroverSolution();
    let dbAfterOracle = new Array<PureStateQubit>();

    for (let i=0; i<order; i++) {
      let db = this.controlQubitDataBaseService.initializeAndGetDataBase(this.adjacencyMatrix.length);
      let reductionDb = this.schoningSolverService.reductionDataBaseUsingSchoningSolver(db, this.satSetOfAdjacencyMatrix);
      let uniformedDb = this.schoningSolverService.uniformProbabilityAfterApplyingSchoning(reductionDb);
      dbAfterOracle = this.groverSolverService.runOracleGroverOnDataBase(uniformedDb, this.satSetOfAdjacencyMatrix, maxLengthAnswer);
      if (!this.checkTotalProbabilityIsValid(this.groverSolverService.calculateTotalProbability(dbAfterOracle))) {
        break;
      }
    }
    this.setChartData(dbAfterOracle);
    this.tenTopAnswerList.push(this.orderListOfPureStateQubitService.findKTopAnswer(dbAfterOracle, 3));
  }

  private setChartData(dataBase: PureStateQubit[]) {
    let xValue = new Array<string>();
    let yValue = new Array<number>();
    for (let i=0; i<dataBase.length; i++) {
      let num = 0;
      for (let t=0; t<dataBase[i].value.length; t++) {
        num = num + (Math.pow(2, t) * dataBase[i].value[t]);
      }

      yValue.push(dataBase[i].probabilityRange * dataBase[i].probabilityRange);
      xValue.push(num.toString());
    }

    this.chartOptionList.push({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: xValue,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: yValue,
          type: 'line',
        },
      ],
    });
  }

  public getProbabilityRangeQubit(qubit: PureStateQubit): number {
    return qubit.probabilityRange * qubit.probabilityRange;
  }
}
