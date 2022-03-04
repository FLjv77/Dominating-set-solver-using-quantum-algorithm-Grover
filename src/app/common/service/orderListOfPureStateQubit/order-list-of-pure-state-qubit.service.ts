import { Injectable } from '@angular/core';
import {PureStateQubit} from "../../../dominatingSolver/model/PureStateQubit";

@Injectable({
  providedIn: 'root'
})
export class OrderListOfPureStateQubitService {

  constructor() { }

  public findKTopAnswer(dataBase: PureStateQubit[], k: number): PureStateQubit[] {
    let KTop = new Array<PureStateQubit>();
    for (let i=0; i<k; i++) {
      KTop.push(new PureStateQubit(0, []));
    }
    for (let i=0; i<dataBase.length; i++) {
      for (let t=0; t<k; t++) {
        if (dataBase[i].probabilityRange > KTop[t].probabilityRange) {
          KTop[t] = dataBase[i]; break;
        }
      }
    }

    return KTop;
  }
}
