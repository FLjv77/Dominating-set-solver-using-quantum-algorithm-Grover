import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SATProducerFromAdjacencyMatrixService {

  constructor() { }

  public getSatClose(adjacencyMatrix: number[][]): number[][] {
    let result = new Array<number[]>();
    for (let i=0; i<adjacencyMatrix.length; i++) {
      let row = new Array<number>();
      for (let t=0; t<adjacencyMatrix[i].length; t++) {
        if (adjacencyMatrix[i][t] == 1) row.push(t);
      }
      result.push(row);
    }
    return result;
  }

  public checkCloseIsSatisfyByGivenSet(close: number[], answerCandid: number[]): boolean {
    let res = false;
    for (let i=0; i<close.length; i++) {
      if (answerCandid[close[i]] == 1) {
        res = true;
        break;
      }
    }
    return res;
  }

  public checkSATSetIsSatisfyByGivenSetAndGetUnsatisfiedOne(sat: number[][], answerCandid: number[]): number[] {
    let unsatisfiedClose = new Array<number>();
    for (let i=0; i<sat.length; i++) {
      if (!this.checkCloseIsSatisfyByGivenSet(sat[i], answerCandid)) {
        unsatisfiedClose = sat[i];
        break;
      }
    }
    return unsatisfiedClose;
  }

  public checkIfSATSetIsSatisfyByGivenSet(sat: number[][], answerCandid: number[]): boolean {
    let res = true;
    for (let i=0; i<sat.length; i++) {
      if (!this.checkCloseIsSatisfyByGivenSet(sat[i], answerCandid)) {
        res = false;
        break;
      }
    }
    return res;
  }

  public getSatLevel(sat: number[][]): number {
    let totalLevel = 0;
    let level = 0;
    for (let i=0; i<sat.length; i++) {
      level = 0;
      for (let t=0; t<sat[i].length; t++) {
        if (sat[i]) level ++;
      }
      if (level > totalLevel) totalLevel = level;
    }
    return totalLevel;
  }
}
