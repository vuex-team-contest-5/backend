import { ValidationError } from 'class-validator';
import { ERROR_CODES } from '../constant/errors';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonException extends HttpException {
  public message: string;
  public statusCode: number;
  public meta: {
    code: number;
    errors: ValidationError[];
    time?: Date;
  };

  constructor(
    code: number,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errors: ValidationError[] = [],
  ) {
    super(
      {
        message,
        statusCode,
        meta: { time: new Date(), code: code, errors: errors },
      },
      statusCode,
    );
    this.meta = {
      time: new Date(),
      code: code,
      errors: errors,
    };
  }

  public static UnknownError(
    data?: any,
    message = 'Unknown error',
    statusCode?: HttpStatus,
  ) {
    return new CommonException(ERROR_CODES.BASE, message, statusCode);
  }

  public static ValidationError(errors?: ValidationError[]) {
    return new CommonException(
      ERROR_CODES.BASE + 1,
      'Validation Error',
      HttpStatus.BAD_REQUEST,
      errors,
    );
  }

  static AllreadyExist(message) {
    return new CommonException(
      ERROR_CODES.BASE + 2,
      `Already exist , message: ${message}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  public static NotFound() {
    return new CommonException(
      ERROR_CODES.BASE + 4,
      'Not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class FileException {
  public static InvalidFileType(errors: ValidationError[] = []) {
    return new CommonException(
      ERROR_CODES.FILE,
      'Invalid file type',
      HttpStatus.BAD_REQUEST,
      errors,
    );
  }
}
