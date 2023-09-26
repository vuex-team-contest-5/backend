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

  static AllreadyExist(item?: string) {
    return new CommonException(
      ERROR_CODES.BASE + 2,
      item ? `${item} already exists` : 'Already exists',
      HttpStatus.BAD_REQUEST,
    );
  }

  public static NotFound(item?: string) {
    return new CommonException(
      ERROR_CODES.BASE + 4,
      item ? `${item} not found` : 'Not found',
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
