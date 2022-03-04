import { Injectable } from '@angular/core';
import {PureStateQubit} from "../../model/PureStateQubit";
import {SATProducerFromAdjacencyMatrixService} from "../SATProducerFromAdjacencyMatrix/satproducer-from-adjacency-matrix.service";
import {Base} from "../../../../assets/const/basePowerOrderAccordingSatLevel";

@Injectable({
  providedIn: 'root'
})
export class GroverSolverService {
  constructor(private satProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService) { }

  public runOracleGroverOnDataBase(dataBase: PureStateQubit[], closeSet: number[][], limitOnAnsLength: number): PureStateQubit[] {
    let validCaseIndex = new Array<number>();
    let totalProbabilityWhichGrowUp = 0;
    let unitProbabilityHaveReduce;
    for (let  i=0; i<dataBase.length; i++) {
      if (this.satProducerFromAdjacencyMatrixService.checkIfSATSetIsSatisfyByGivenSet(closeSet, dataBase[i].value) &&
        this.applyLimitationIterationOnRunOracle(dataBase[i].value, limitOnAnsLength)) {
        validCaseIndex.push(i);
        totalProbabilityWhichGrowUp += (2 * (dataBase[i].probabilityRange) * (dataBase[i].probabilityRange));
      }
    }
    unitProbabilityHaveReduce = totalProbabilityWhichGrowUp / (dataBase.length - validCaseIndex.length);

    for (let i=0; i<dataBase.length; i++) {
      if (validCaseIndex.indexOf(i) > -1) {
        dataBase[i].probabilityRange = Math.sqrt(3 * (dataBase[i].probabilityRange) * (dataBase[i].probabilityRange));
      } else {
        dataBase[i].probabilityRange = Math.sqrt((dataBase[i].probabilityRange * dataBase[i].probabilityRange) - unitProbabilityHaveReduce);
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
}
