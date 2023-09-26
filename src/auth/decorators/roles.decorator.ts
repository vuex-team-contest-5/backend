import { SetMetadata } from '@nestjs/common';

export const CHECK_ACCESSES_KEY = 'check_access_key';

export const CheckAccesses = (...accesses: string[]) =>
  SetMetadata(CHECK_ACCESSES_KEY, accesses);
