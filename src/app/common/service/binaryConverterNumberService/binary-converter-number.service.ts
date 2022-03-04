import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BinaryConverterNumberService {

  constructor() { }

  public convertDecimalToBinary(decimal: number): number[] {
    let binaryResult = new Array<number>();
    let localDecimal = decimal;
    while (localDecimal > 0) {
      binaryResult.push(localDecimal % 2);
      localDecimal = Math.floor(localDecimal / 2);
    }
    return binaryResult;
  }

  public checkEqualityTowBinaryNumber(num1: number[], num2: number[]): boolean {
    let res = true;
    if (num1.length == num2.length) {
      for (let i=0; i<num1.length; i++) {
        if (num1[i] != num2[i]) {
          res = false;
          break;
        }
      }
    } else res = false;
    return res;

  }
}
