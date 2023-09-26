import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadDto } from '../dto/jwt.dto';
import { CHECK_ACCESSES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAccesses = this.reflector.getAllAndOverride<string[]>(
      CHECK_ACCESSES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user, headers }: { user: JwtPayloadDto; headers: any } = context
      .switchToHttp()
      .getRequest();

    // const storeId = headers['store-id'];
    // if (!storeId) {
    //   return false;
    // }

    if (!requiredAccesses) {
      return true;
    }
    return true;
    // return requiredAccesses.some(
    //   (requiredAccess) =>
    //     user.stores[storeId].role.accessRights[requiredAccess],
    // );
  }
}
