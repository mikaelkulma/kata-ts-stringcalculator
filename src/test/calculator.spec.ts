import { expect, use } from "chai";
import * as TypeMoq from "typemoq";

import Calculator from "../main/Calculator";
import Logger from "../main/Logger";

describe("StringCalculator", () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  it("Should return 0 when given an empty string", () => {
    expect(calc.add("")).to.equal(0);
  });

  it("Should return the number when given a single number", () => {
    expect(calc.add("1")).to.equal(1);
  });

  it("Should return the sum of two numbers", () => {
    expect(calc.add("1, 1")).to.equal(2);
  });

  it("Should allow an unknown amount of numbers", () => {
    expect(calc.add("1, 1, 3, 2, 5")).to.equal(12);
  });

  it("Should allow newlines as separators", () => {
    expect(calc.add("1, 1\n 3, 2, 5")).to.equal(12);
  });

  it("Should support configurable separators", () => {
    expect(calc.add("//;\n1; 1; 3")).to.equal(5);
  });

  it("Should throw an exception when given negative numbers", () => {
    expect((() => calc.add("//;\n-12; -11"))).to.throw(Error);
  });

  it("Should ignore numbers larger than 1000", () => {
    expect(calc.add("1, 2, 3, 1001")).to.equal(6);
  });

  it("Should support separators of any length", () => {
    expect(calc.add("//[IamASeparator]\n2IamASeparator1IamASeparator3")).to.equal(6);
  }); 

  it("Should support multiple delimiters", () => {
    expect(calc.add("//[;][,]\n2;1;3")).to.equal(6);
  }); 

  it("Should log each add with a logger service", () => {
    const logger: TypeMoq.IMock<Logger> = TypeMoq.Mock.ofType<Logger>();
    calc.logger = logger.object

    calc.add("1,2,3")

    logger.verify(x => x.log(TypeMoq.It.isValue("6")), TypeMoq.Times.atLeastOnce());
    
  }); 
});
