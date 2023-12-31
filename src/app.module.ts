import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ENV } from './common/config/config';
import { TypeModule } from './modules/type/type.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ClientModule } from './modules/client/client.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { AdminModule } from './modules/admin/admin.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: ENV.DB.POSTGRES.HOST,
      port: ENV.DB.POSTGRES.PORT,
      username: ENV.DB.POSTGRES.USER,
      password: ENV.DB.POSTGRES.PASSWORD,
      database: ENV.DB.POSTGRES.DATABASE,
      autoLoadModels: true,
      logging: false,
      pool: { min: 10, max: 30 },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
    AuthModule,
    AdminModule,
    TypeModule,
    TeacherModule,
    ClientModule,
    CategoryModule,
    ProductModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
