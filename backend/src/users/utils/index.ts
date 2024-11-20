import * as argon2 from 'argon2';
import * as crypto from 'crypto';

const hashingConfig = {
  // based on OWASP cheat sheet recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of itetations
  secret: Buffer.from('')
};

export const hashPassword = async (password: string) => {
  let salt = crypto.randomBytes(16);
  return await argon2.hash(password, {
    ...hashingConfig,
    salt,
  });
};

export const verifyPasswordWithHash = async (
  password: string,
  hash: string,
) => {
  return await argon2.verify(hash, password, hashingConfig);
};
