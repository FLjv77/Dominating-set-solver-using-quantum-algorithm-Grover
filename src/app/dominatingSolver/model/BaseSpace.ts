import {IBaseSpace} from "../interface/IBaseSpace";
import {ConstValue} from "../shared/constValue";

export abstract class BaseSpace implements IBaseSpace {
  firstComponent: number;
  secondComponent: number;
  probabilityRangeFirstComponent: number;
  probabilityRangeSecondComponent: number;

  protected constructor(
    firstComponent: number,
    secondComponent: number,
    probabilityRangeFirstComponent: number,
    probabilityRangeSecondComponent: number) {
    this.firstComponent = firstComponent;
    this.secondComponent = secondComponent;
    this.probabilityRangeFirstComponent = probabilityRangeFirstComponent;
    this.probabilityRangeSecondComponent = probabilityRangeSecondComponent;
  }

  abstract getProbabilityRangeFirstComponent(): number;
  abstract getProbabilityRangeSecondComponent(): number;
}

export class BlockSphere extends BaseSpace{
  constructor() {
    super(1, 0, new ConstValue().sqrtTowPowerMinustOne, new ConstValue().sqrtTowPowerMinustOne);
  }
  getProbabilityRangeFirstComponent(): number {
    return Math.sqrt(1- ((this.probabilityRangeSecondComponent) * (this.probabilityRangeSecondComponent)));
  }

  getProbabilityRangeSecondComponent(): number {
    return Math.sqrt(1- ((this.probabilityRangeFirstComponent) * (this.probabilityRangeFirstComponent)));
  }
}
