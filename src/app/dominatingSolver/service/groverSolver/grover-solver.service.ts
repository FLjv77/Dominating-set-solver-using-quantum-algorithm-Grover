import { Injectable, EventEmitter } from '@angular/core';
import {PureStateQubit} from "../../model/PureStateQubit";
import {SATProducerFromAdjacencyMatrixService} from "../SATProducerFromAdjacencyMatrix/satproducer-from-adjacency-matrix.service";
import {Base} from "../../../../assets/const/basePowerOrderAccordingSatLevel";
import { SchoningSolverService } from '../schoningSolver/schoning-solver.service';

@Injectable({
  providedIn: 'root'
})
export class GroverSolverService {
  public handleStopConditionAlgorithem = new EventEmitter<boolean>();
  constructor(private satProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService,
    private schoningSolverService: SchoningSolverService,
    ) { }

  public runOracleGroverOnDataBase(dataBase: PureStateQubit[], closeSet: number[][], limitOnAnsLength: number): PureStateQubit[] {
    let validCaseIndex = new Array<number>();
    let totalProbabilityWhichGrowUp = 0;
    let unitProbabilityHaveReduce;

    let checkConditionStop = 0;
    for (let  i=0; i<dataBase.length; i++) {
      let checkSatisfactionIndex = this.satProducerFromAdjacencyMatrixService.checkIfSATSetIsSatisfyByGivenSet(closeSet, dataBase[i].value);
      if (checkSatisfactionIndex == -1) {
        if(this.getNumberOfOneInPossibleAnswer(dataBase[i].value) <= limitOnAnsLength) {
          validCaseIndex.push(i);
          totalProbabilityWhichGrowUp += (Math.sqrt(dataBase[i].probabilityRange) - dataBase[i].probabilityRange);
          dataBase[i].probabilityRange = Math.sqrt(dataBase[i].probabilityRange);
        } else {
          let changedState = this.schoningSolverService.changeSuggestionAnswerThatUnsatisfiedAnswerLenght(dataBase[i]);
          dataBase[i] = changedState;
          checkConditionStop ++;
        }
      }

      else {
        checkConditionStop ++;
        // change unsatisfed answer
        let changedState = this.schoningSolverService.changeSuggestionAnswerThatUnsatisfiedClose(closeSet[checkSatisfactionIndex], dataBase[i]);
        dataBase[i] = changedState;
      }

      if(checkConditionStop == 0) {
        this.handleStopConditionAlgorithem.emit(true);
        break;
      }
    }

    unitProbabilityHaveReduce = totalProbabilityWhichGrowUp / (dataBase.length - validCaseIndex.length);


    for (let i=0; i<dataBase.length; i++) {
      if (validCaseIndex.indexOf(i) == -1) {
        if((dataBase[i].probabilityRange * dataBase[i].probabilityRange) >= unitProbabilityHaveReduce) {
          dataBase[i].probabilityRange = Math.sqrt((dataBase[i].probabilityRange * dataBase[i].probabilityRange) - unitProbabilityHaveReduce);
        } else {
          dataBase[i].probabilityRange = 0;
        }
      }
    }
    return dataBase;
  }

  public calculateTotalProbability(db: PureStateQubit[]): number {
    let total = 0;
    for (let i=0; i<db.length; i++) {
      total += (db[i].probabilityRange * db[i].probabilityRange)
    }
    return total;
  }

  private applyLimitationIterationOnRunOracle(ans: number[], limit: number): boolean {
    let actualLength = 0;
    for (let i=0; i<ans.length; i++) {
      if (ans[i] == 1) actualLength +=1;
    }

    return actualLength <= limit;
  }

  public getMaxOrderGroverWithSchoning(dimensionDB: number, satLevel: number): number {
    let order = 0;
    switch (satLevel) {
      case 2: order = Math.pow(Base.sat_2PowerBase, dimensionDB); break;
      case 3: order = Math.pow(Base.sat_3PowerBase, dimensionDB); break;
      case 4: order = Math.pow(Base.sat_4PowerBase, dimensionDB); break;
      case 5: order = Math.pow(Base.sat_5PowerBase, dimensionDB); break;
      case 6: order = Math.pow(Base.sat_6PowerBase, dimensionDB); break;
      case 7: order = Math.pow(Base.sat_7PowerBase, dimensionDB); break;
      case 8: order = Math.pow(Base.sat_8PowerBase, dimensionDB); break;
    }

    return order;
  }

  private getNumberOfOneInPossibleAnswer(vector: number[]): number {
    let counter = 0;
    for(let i=0; i<vector.length; i++) {
      if(vector[i] == 1) counter++;
    }

    return counter;
  }
}
