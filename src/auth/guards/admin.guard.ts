import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadDto } from '../dto/jwt.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user, headers }: { user: JwtPayloadDto; headers: any } = context
      .switchToHttp()
      .getRequest();

    return user.role === 'admin';
  }
}
