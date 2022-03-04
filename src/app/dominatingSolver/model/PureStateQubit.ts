export class PureStateQubit {
  probabilityRange: number;
  value: Array<number>;

  constructor(probabilityRange: number, value: Array<number>) {
    this.probabilityRange = probabilityRange;
    this.value = value;
  }
}
