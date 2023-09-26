import { ENV } from '../../common/config/config';

export class JwtPayloadDto {
  id: string;
  organizationId: string;
}
export const jwtConstants = {
  secret: ENV.JWT.SECRET_ACCESS,
  expiresIn: ENV.JWT.EXPIRE_ACCESS,
  refreshSecret: ENV.JWT.SECRET_REFRESH,
  refreshExpiresIn: ENV.JWT.EXPIRE_REFRESH,
};
