import { Injectable } from '@angular/core';
import {PureStateQubit} from "../../model/PureStateQubit";
import {SATProducerFromAdjacencyMatrixService} from "../SATProducerFromAdjacencyMatrix/satproducer-from-adjacency-matrix.service";
import {BinaryConverterNumberService} from "../../../common/service/binaryConverterNumberService/binary-converter-number.service";

@Injectable({
  providedIn: 'root'
})
export class SchoningSolverService {

  constructor(private sATProducerFromAdjacencyMatrixService: SATProducerFromAdjacencyMatrixService,
              private binaryConverterNumberService: BinaryConverterNumberService) {}

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

  public changeSuggestionAnswerThatUnsatisfiedClose(unsatisfiedClose: number[], suggestionAns: PureStateQubit): PureStateQubit {
    for (let i=0; i<unsatisfiedClose.length; i++) {
      if (suggestionAns.value[unsatisfiedClose[i]] != 1) {
        suggestionAns.value[unsatisfiedClose[i]] = 1;
        break;
      }
    }
    return suggestionAns;
  }

  public changeSuggestionAnswerThatUnsatisfiedAnswerLenght(suggestionAns: PureStateQubit): PureStateQubit {
    for (let i=0; i<suggestionAns.value.length; i++) {
      if (suggestionAns.value[i] != 0) {
        suggestionAns.value[i] = 0;
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
            uniformedDB[t].probabilityRange = Math.sqrt((uniformedDB[t].probabilityRange * uniformedDB[t].probabilityRange) + (dataBase[i].probabilityRange)*(dataBase[i].probabilityRange));
            break;
          }
        }
      }
    }
    return uniformedDB;
  }
}
