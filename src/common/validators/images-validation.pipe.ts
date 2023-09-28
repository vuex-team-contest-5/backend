import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImagesValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = ['.jpeg', '.jpg', '.png'];
  private readonly maxSize = 1 * 1024 * 1024; // 1 MB

  transform(value: any) {
    try {
      if (value && Array.isArray(value)) {
        for (const file of value) {
          const fileExtension = extname(file.originalname).toLowerCase();

          if (!this.allowedExtensions.includes(fileExtension)) {
            throw new BadRequestException(
              `File '${file.originalname}' has an invalid extension. Only JPEG, JPG, and PNG image files are allowed.`,
            );
          }

          if (file.size > this.maxSize) {
            throw new BadRequestException(
              `File '${file.originalname}' exceeds the maximum allowed file size of 1 MB.`,
            );
          }
        }

        return value;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
