import { Component, OnInit } from '@angular/core';
import {SATProducerFromAdjacencyMatrixService} from "../../service/SATProducerFromAdjacencyMatrix/satproducer-from-adjacency-matrix.service";
import {ControlQubitDataBaseService} from "../../service/controlQubitDataBase/control-qubit-data-base.service";
import {BinaryConverterNumberService} from "../../../common/service/binaryConverterNumberService/binary-converter-number.service";
import {SchoningSolverService} from "../../service/schoningSolver/schoning-solver.service";
import {GroverSolverService} from "../../service/groverSolver/grover-solver.service";
import {EChartsOption} from "echarts/types/dist/echarts";
import {PureStateQubit} from "../../model/PureStateQubit";

@Component({
  selector: 'app-dominating-solver-home',
  templateUrl: './dominating-solver-home.component.html',
  styleUrls: ['./dominating-solver-home.component.scss']
})
export class DominatingSolverHomeComponent implements OnInit {

  private satSetOfAdjacencyMatrix: number[][] = [];
  private adjacencyMatrix: number[][] = [];
  private maxLengthAnswer: number = 0;
  public chartOptionList: EChartsOption[] = [{}];

  constructor(private satProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService,
              private controlQubitDataBaseService: ControlQubitDataBaseService,
              private binaryConverterNumberService: BinaryConverterNumberService,
              private schoningSolverService: SchoningSolverService,
              private groverSolverService: GroverSolverService) { }

  ngOnInit(): void {
    this.createAdjacencyMatrix();
    this.creatSatFromAdjacencyMatrix();
    this.setMaxLengthAnswer(4);
    this.runIterativeLimitationOnGrover();
  }

  private createAdjacencyMatrix() {
    this.adjacencyMatrix =
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
    ];
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
      this.runGroverAlgorithmWithSchoning(i);
    }
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
        console.log(i);
        break;
      }
    }
    this.setChartData(dbAfterOracle);
  }

  private setChartData(dataBase: PureStateQubit[]) {
    let xValue = new Array<string>();
    let yValue = new Array<number>();
    for (let i=0; i<dataBase.length; i++) {
      let num = 0;
      for (let t=0; t<dataBase[i].value.length; t++) {
        num += (Math.pow(2, t) * dataBase[i].value[t]);
      }

      yValue.push(dataBase[i].probabilityRange * dataBase[i].probabilityRange);
      xValue.push(num.toString());
    }

    this.chartOptionList.push({
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
}
