import { UUIDVersion } from 'class-validator';
export {};
declare global {
  /**
   *Environment types
   * - dev: development
   * - prod: production
   */

  type ServiceEnvType = 'development' | 'production';

  interface ImportMetaEnv {
    ENVIRONMENT: ServiceEnvType;
    HTTP_HOST: string;
    HTTP_PORT: number;
    DB: {
      POSTGRES: {
        USER: string;
        HOST: string;
        DATABASE: string;
        PASSWORD: string;
        PORT: number;
        UUID_VERSION: UUIDVersion;
      };
      REDIS: {
        URL: string;
        PORT: number;
        PASSWORD: string;
      };
      MINIO: {
        END_POINT: string;
        PORT: number;
        ACCESS_KEY: string;
        SECRET_KEY: string;
        FILES_BUCKET: string;
        BASE_URL: string;
      };
    };
    BOT: {
      TOKEN: string;
      OWNER_ID: number;
      SMS_CHANNEL: string | number;
    };
    JWT: {
      SECRET_ACCESS: string;
      SECRET_REFRESH: string;
      EXPIRE_ACCESS: string;
      EXPIRE_REFRESH: string;
    };
    PLAY_MOBILE: {
      USERNAME: string;
      PASSWORD: string;
      URL: string;
    };
    STATIC_FILE_PATH: string;
  }
}
