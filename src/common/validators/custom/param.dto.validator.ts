/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'paramMin', async: false })
export class IsParamMin implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return (
      !isNaN(parseInt(text)) &&
      /^[0-9]*$/g.test(text) &&
      new Date(parseInt(text)).toString() !== 'Invalid Date'
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `Min must timestemp! Example ${new Date().getTime()}`;
  }
}

@ValidatorConstraint({ name: 'paramMax', async: false })
export class IsParamMax implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return (
      !isNaN(parseInt(text)) &&
      /^[0-9]*$/g.test(text) &&
      new Date(parseInt(text)).toString() !== 'Invalid Date'
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `Max must timestemp! Example ${new Date().getTime()}`;
  }
}
