import { ValidationError } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { CommonException } from '../common/errors/common.error';
import { ERROR_CODES } from '../common/constant/errors';

export class AuthException extends CommonException {
  constructor(
    code: number,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errors: ValidationError[] = [],
  ) {
    super(code, message, statusCode, errors);
  }

  public static Unauthorized() {
    return new CommonException(
      ERROR_CODES.AUTH,
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
