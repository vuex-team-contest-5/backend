import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CommonException } from '../errors/common.error';

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {
  constructor(groups = []) {
    this.groups = groups;
  }

  private groups: string[];

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: false,
      groups: this.groups,
    });

    const errors = await validate(object, {
      groups: this.groups,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw CommonException.ValidationError(errors);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
