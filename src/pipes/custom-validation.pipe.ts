import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        success: false,
        result: {
          errors: formattedErrors,
        },
      });
    }

    return value;
  }

  private formatErrors(errors: any[]) {
    const result = {};
    errors.forEach((error) => {
      if (error.constraints) {
        result[error.property] = Object.values(error.constraints)[0];
      }
      if (error.children && error.children.length > 0) {
        result[error.property] = this.formatErrors(error.children);
      }
    });
    return result;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
