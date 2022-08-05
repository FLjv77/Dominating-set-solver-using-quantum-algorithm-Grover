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
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dominating-solver-home',
  templateUrl: './dominating-solver-home.component.html',
  styleUrls: ['./dominating-solver-home.component.scss']
})

export class DominatingSolverHomeComponent implements OnInit {
  private baseForBestClassicAlhorithem: number = 1.5137;
  public order = 0;
  public maxOrder = 0;
  public showresualt: boolean = false;

  private stopAlgorithm: boolean = false;
  public node: NodeGraph;
  private satSetOfAdjacencyMatrix: number[][] = [];
  public tenTopAnswerList: PureStateQubit[][] = [];
  private adjacencyMatrix: number[][] = [];
  private maxLengthAnswer: number = 0;
  public maxLengthAnswerControl = new FormControl();
  public chartOptionList: EChartsOption[] = [{}];

  constructor(private satProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService,
              private controlQubitDataBaseService: ControlQubitDataBaseService,
              private orderListOfPureStateQubitService: OrderListOfPureStateQubitService,
              private schoningSolverService: SchoningSolverService,
              private groverSolverService: GroverSolverService) {

    this.node = new NodeGraph(0, 0);
    this.subscribeCheckStopAlgorithem();
  }

  ngOnInit(): void {
  }

  private subscribeCheckStopAlgorithem() {
    this.groverSolverService.handleStopConditionAlgorithem.subscribe((res: boolean) => {
      this.stopAlgorithm = res;
      this.maxOrder = this.getMaximumOrder();
      this.showresualt = true;
    });
  }

  public runAlgorithm(matrix: number[][]) {
    this.createAdjacencyMatrix(matrix);
    this.creatSatFromAdjacencyMatrix();
    this.setMaxLengthAnswer();
    this.runIterativeLimitationOnGrover();
  }

  private createAdjacencyMatrix(matrix: number[][]) {
    this.adjacencyMatrix = matrix;
  }

  private creatSatFromAdjacencyMatrix() {
    this.satSetOfAdjacencyMatrix = new Array<number[]>();
    this.satSetOfAdjacencyMatrix = this.satProducerFromAdjacencyMatrixService.getSatClose(this.adjacencyMatrix);
  }

  private getOrderNewGroverSolution(): number {
    let level = this.satProducerFromAdjacencyMatrixService.getSatLevel(this.satSetOfAdjacencyMatrix);
    return Math.floor(this.groverSolverService.getMaxOrderGroverWithSchoning(this.adjacencyMatrix.length, level));
  }

  private setMaxLengthAnswer() {
    this.maxLengthAnswer = this.maxLengthAnswerControl.value;
  }

  private checkTotalProbabilityIsValid(probability: number): boolean {
    return probability > 0.9 && probability < 1.1;
  }

  private runIterativeLimitationOnGrover() {
    this.runGroverAlgorithmWithSchoning(this.maxLengthAnswer);
  }

  private checkStopLoopCondition(dataBase: PureStateQubit[], index: number): boolean {
    let res = true;
    let listOfProbability = [];
    let maxProbablity_1_index = -1;
    let maxProbablity_2_index = -1;
    let maxProbablity_3_index = -1;

    for(let i=0; i < dataBase.length; i++) {
      if(dataBase[i].probabilityRange > maxProbablity_1_index) maxProbablity_1_index = i;
      else if(dataBase[i].probabilityRange > maxProbablity_2_index && dataBase[i].probabilityRange < maxProbablity_1_index) maxProbablity_2_index = i;
      else if(dataBase[i].probabilityRange > maxProbablity_3_index && dataBase[i].probabilityRange < maxProbablity_2_index) maxProbablity_3_index = i;

      listOfProbability.push(dataBase[i].probabilityRange *   1000);
    }

    if(
      this.satProducerFromAdjacencyMatrixService.checkIfSATSetIsSatisfyByGivenSet(this.satSetOfAdjacencyMatrix, dataBase[maxProbablity_1_index].value) == -1
    ) res = false;
    else if(
      this.satProducerFromAdjacencyMatrixService.checkIfSATSetIsSatisfyByGivenSet(this.satSetOfAdjacencyMatrix, dataBase[maxProbablity_2_index].value) == -1
    ) res = false;
    else if (
      this.satProducerFromAdjacencyMatrixService.checkIfSATSetIsSatisfyByGivenSet(this.satSetOfAdjacencyMatrix, dataBase[maxProbablity_3_index].value) == -1
    ) res = false;
    return res;
  }

  private getMaximumOrder(): number {
    return Math.pow(this.baseForBestClassicAlhorithem, this.adjacencyMatrix.length);
  }

  private runGroverAlgorithmWithSchoning(maxLengthAnswer: number) {
    //TODO => CHANGE THE WAY GET ORDER
    let dbAfterOracle = new Array<PureStateQubit>();
    let db = this.controlQubitDataBaseService.initializeAndGetDataBase(this.adjacencyMatrix.length);
    while (!this.stopAlgorithm) {
      dbAfterOracle = this.groverSolverService.runOracleGroverOnDataBase(db, this.satSetOfAdjacencyMatrix, maxLengthAnswer);
      db = this.schoningSolverService.uniformProbabilityAfterApplyingSchoning(dbAfterOracle);

      this.order ++;

      if((this.order >= this.getMaximumOrder())) break;
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
