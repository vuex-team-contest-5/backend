import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { swaggerConfig, swaggerOptions } from './swagger';
import { ENV } from './common/config/config';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document, swaggerOptions);

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(ENV.HTTP_PORT, ENV.HTTP_HOST);
  console.log(`app run on port: ${ENV.HTTP_PORT}`);
}

bootstrap();
