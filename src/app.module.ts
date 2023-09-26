import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ENV } from './common/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: ENV.DB.POSTGRES.HOST,
      port: ENV.DB.POSTGRES.PORT,
      username: ENV.DB.POSTGRES.USER,
      password: ENV.DB.POSTGRES.PASSWORD,
      database: ENV.DB.POSTGRES.DATABASE,
      synchronize: true, // !!do not use in prod
      autoLoadModels: true,
      pool: { min: 10, max: 30 },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
