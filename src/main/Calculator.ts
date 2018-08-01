import Logger from "./Logger";

export default class Calculator {
  private readonly defaultSeparator = /,|\n/;
  private _logger: Logger;

  public set logger(value: Logger) {
    this._logger = value;
  }

  add(input: string): number {
    const sum = this.tokenize(input, this.separatorFrom(input))
      .map(this.removeWhitespace())
      .filter(this.isNumeric())
      .filter(this.isSmallerOrEqualThan1000())
      .map(this.castToNumber())
      .map(this.errorOnNegativeNumber())
      .reduce(this.sum(), 0);
      
      this._logger && this._logger.log(sum.toString());

      return sum;
  }

  private tokenize(input: string, separator: RegExp) {
    return input.split(separator);
  }

  private separatorFrom(input: string): RegExp {
    if (this.inputHasConfiguredSeparator(input)) {
      return this.extractConfiguredSeparator(input);
    }
    return this.defaultSeparator;
  }

  private inputHasConfiguredSeparator(input: string): boolean {
    return !!input.match("^//.+\n");
  }

  private extractConfiguredSeparator(input: string) {
    const separator = input
      .split("\n")
      .shift()
      .split("[")
      .map(e => e.replace("]", ""))
      .join("|")
      .slice(2);
    return new RegExp(separator);
  }

  private removeWhitespace(): (value: string) => string {
    return e => e.trim();
  }

  private isNumeric(): (value: string) => any {
    return e => +e;
  }

  private isSmallerOrEqualThan1000(): (value: string) => any {
    return e => +e <= 1000;
  }

  private castToNumber(): (value: string) => number {
    return e => +e;
  }

  private errorOnNegativeNumber(): (value: number) => number {
    return e => {
      if (+e < 0) throw new Error("oh noes");
      return +e;
    };
  }

  private sum(): (previousValue: number, currentValue: number) => number {
    return (previousValue, currentValue) => {
      return previousValue + currentValue;
    };
  }
}
