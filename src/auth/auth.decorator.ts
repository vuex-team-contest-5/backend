import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CHECK_ACCESSES_KEY } from './decorators/roles.decorator';

export function Auth(...requiredAccessRights: string[]) {
  return applyDecorators(
    SetMetadata(CHECK_ACCESSES_KEY, requiredAccessRights),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiUnauthorizedResponse({
      schema: {
        example: { statusCode: 401, message: 'Unauthorized' },
      },
      description: 'Unauthorized',
    }),
  );
}
