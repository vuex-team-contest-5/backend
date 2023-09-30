import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from './mail/mail.module';
import { ClientModel } from '../modules/client/client.model';
import { AdminModel } from '../modules/admin/admin.model';
import { ClientModule } from '../modules/client/client.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../modules/admin/admin.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProductModel } from '../modules/product/product.model';
import { TeacherModel } from '../modules/teacher/teacher.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ClientModel,
      AdminModel,
      ProductModel,
      TeacherModel,
    ]),
    AdminModule,
    ClientModule,
    MailModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
