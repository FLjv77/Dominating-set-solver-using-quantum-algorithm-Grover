import { Injectable } from '@angular/core';
import {PureStateQubit} from "../../model/PureStateQubit";
import {SATProducerFromAdjacencyMatrixService} from "../SATProducerFromAdjacencyMatrix/satproducer-from-adjacency-matrix.service";
import {BinaryConverterNumberService} from "../../../common/service/binaryConverterNumberService/binary-converter-number.service";

@Injectable({
  providedIn: 'root'
})
export class SchoningSolverService {

  constructor(private sATProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService,
              private binaryConverterNumberService: BinaryConverterNumberService) { }

  public reductionDataBaseUsingSchoningSolver(dataBase: PureStateQubit[], closeSet: number[][]): PureStateQubit[] {
    let reductionDB = new Array<PureStateQubit>();
    for (let i=0; i<dataBase.length; i++) {
      let unsatisfiedCloseIfExist = this.sATProducerFromAdjacencyMatrixService.checkSATSetIsSatisfyByGivenSetAndGetUnsatisfiedOne(closeSet, dataBase[i].value);
      if (unsatisfiedCloseIfExist.length > 0) {
        reductionDB.push(this.changeSuggestionAnswerThatUnsatisfiedClose(unsatisfiedCloseIfExist, dataBase[i]));
      } else {
        reductionDB.push(dataBase[i]);
      }
    }
    return reductionDB;
  }

  private changeSuggestionAnswerThatUnsatisfiedClose(unsatisfiedClose: number[], suggestionAns: PureStateQubit): PureStateQubit {
    for (let i=0; i<unsatisfiedClose.length; i++) {
      if (suggestionAns.value[unsatisfiedClose[i]] != 1) {
        suggestionAns.value[unsatisfiedClose[i]] = 1;
        break;
      }
    }
    return suggestionAns;
  }

  public uniformProbabilityAfterApplyingSchoning(dataBase: PureStateQubit[]): PureStateQubit[] {
    let uniformedDB = new Array<PureStateQubit>();
    let floatProbability = 0;
    for (let i=0; i<dataBase.length; i++) {
      if (i==0) uniformedDB.push(dataBase[i]);
      else {
        for (let t=0; t<uniformedDB.length; t++) {
          if (!this.binaryConverterNumberService.checkEqualityTowBinaryNumber(
            uniformedDB[t].value, dataBase[i].value
          )) {
            if (t == uniformedDB.length -1) {
              uniformedDB.push(dataBase[i]);
              break;
            }
          } else {
            floatProbability = floatProbability + ((dataBase[i].probabilityRange)*(dataBase[i].probabilityRange));
            break;
          }
        }
      }
    }

    let extraProbabilityOverDB = floatProbability / (uniformedDB.length);
    for (let i=0; i<uniformedDB.length; i++) {
      uniformedDB[i].probabilityRange = Math.sqrt((uniformedDB[i].probabilityRange * uniformedDB[i].probabilityRange) + extraProbabilityOverDB);
    }
    return uniformedDB;
  }
}
