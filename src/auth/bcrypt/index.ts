import * as bcrypt from 'bcrypt';

const defaultSaltOrRounds = 10;
// const password = 'random_password';
// async function name() {
//   const hash = await bcrypt.hash(password, defaultSaltOrRounds);
//   const salt = await bcrypt.genSalt();
//   const isMatch = await bcrypt.compare(password, hash);
// }

export async function hashPassword(
  password: string | Buffer,
  saltOrRounds: number | string = defaultSaltOrRounds,
): Promise<string> {
  return await bcrypt.hash(password, saltOrRounds);
}

export async function comparePassword(
  password: string | Buffer,
  encrypted: string,
): Promise<boolean> {
  return await bcrypt.compare(password, encrypted);
}
