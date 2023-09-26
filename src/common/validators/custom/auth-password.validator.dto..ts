/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'authPassword', async: false })
export class IsPasswordsMatch implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return args.object['password'] === args.object['passwordRetry'];
  }

  defaultMessage(args: ValidationArguments) {
    return `Passwords must match!`;
  }
}
