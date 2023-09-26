import { UUIDVersion } from 'class-validator';
import { config } from 'dotenv';
import { join, resolve } from 'path';
config({
  path: process.env.NODE_ENV
    ? process.env.NODE_ENV === 'production'
      ? resolve(process.cwd(), '.prod.env')
      : resolve(process.cwd(), '.dev.env')
    : resolve(process.cwd(), '.env'),
});

const getOrReturnDefaultNumber = (value: unknown, def: number): number =>
  Number.isFinite(+value) && !Number.isNaN(+value) ? +value : def;

export const ENV: ImportMetaEnv = {
  ENVIRONMENT: (process.env.ENVIRONMENT || 'development') as ServiceEnvType,
  HTTP_HOST: process.env.HTTP_HOST || '0.0.0.0',
  HTTP_PORT: getOrReturnDefaultNumber(process.env.HTTP_PORT, 4000),
  DB: {
    POSTGRES: {
      USER: process.env.POSTGRES_USER || 'postgres',
      HOST: process.env.POSTGRES_HOST || 'localhost',
      DATABASE: process.env.POSTGRES_DATABASE || 'mono_pos',
      PASSWORD: process.env.POSTGRES_PASSWORD,
      PORT: getOrReturnDefaultNumber(process.env.POSTGRES_PORT, 5432),
      UUID_VERSION: (process.env.POSTGRES_UUID_VERSION as UUIDVersion) || 4,
    },
    REDIS: {
      URL: process.env.REDIS_URL || '',
      PASSWORD: process.env.REDIS_PASSWORD || '',
    },
    MINIO: {
      END_POINT: process.env.MINIO_END_POINT || 'localhost',
      PORT: getOrReturnDefaultNumber(process.env.MINIO_PORT, 9000),
      ACCESS_KEY: process.env.MINIO_ACCESS_KEY || '',
      SECRET_KEY: process.env.MINIO_SECRET_KEY || '',
      FILES_BUCKET: process.env.MINIO_FILES_BUCKET || '',
      BASE_URL: process.env.MINIO_BASE_URL || '',
    },
  },
  BOT: {
    TOKEN: process.env.BOT_TOKEN || '',
    OWNER_ID: getOrReturnDefaultNumber(process.env.BOT_OWNER, 334307783),
    SMS_CHANNEL: process.env.SMS_CHANNEL || -1001665694254,
  },
  JWT: {
    SECRET_ACCESS: process.env.JWT_SECRET || 'JWT_SECRET_ACCESS',
    SECRET_REFRESH: process.env.JWT_SECRET_REFRESH || 'JWT_SECRET_REFRESH',
    EXPIRE_ACCESS: process.env.JWT_EXPIRE_ACCESS || '15M',
    EXPIRE_REFRESH: process.env.JWT_EXPIRE_REFRESH || '1W',
  },
  PLAY_MOBILE: {
    USERNAME: process.env.PLAY_MOBILE_USERNAME,
    PASSWORD: process.env.PLAY_MOBILE_PASSWORD,
    URL: process.env.PLAY_MOBILE_URL ?? 'http://91.204.239.44/broker-api/send',
  },
  STATIC_FILE_PATH: join(__dirname, '../../static'),
};
