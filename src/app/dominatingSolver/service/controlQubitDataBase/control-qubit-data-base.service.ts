import { Injectable } from '@angular/core';
import {PureStateQubit} from "../../model/PureStateQubit";
import {BinaryConverterNumberService} from "../../../common/service/binaryConverterNumberService/binary-converter-number.service";

@Injectable({
  providedIn: 'root'
})
export class ControlQubitDataBaseService {

  constructor(private binaryConverterNumberService: BinaryConverterNumberService) { }

  public initializeAndGetDataBase(dimension: number): Array<PureStateQubit> {
    let db = new Array<PureStateQubit>();
    let dbSize = 1;
    for (let i=0; i<dimension; i++) {
      dbSize *=2;
    }
    const pRange = Math.sqrt(1 / dbSize);
    for (let i=0; i<dbSize; i++) {
      db.push(new PureStateQubit(pRange, this.fixSizeDataToDBWordLength(dimension, this.binaryConverterNumberService.convertDecimalToBinary(i)).reverse()));
    }
    return db;
  }

  private fixSizeDataToDBWordLength(length: number, interList: number[]): number[] {
    let zeroRow = new Array<number>();
    for (let i=0; i<length; i++) {
      zeroRow.push(0);
    }

    for (let i=0; i < interList.length && i<length; i++) {
      zeroRow[i] = interList[i];
    }

    return zeroRow;
  }
}
