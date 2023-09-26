/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsDateTimeStamp', async: false })
export class IsDateTimeStamp {
  validate(text: string, args: ValidationArguments) {
    return (
      !isNaN(parseInt(text)) &&
      /^[0-9]*$/g.test(text) &&
      new Date(parseInt(text)).toString() !== 'Invalid Date'
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must timestemp! Example ${new Date().getTime()}`;
  }
}
