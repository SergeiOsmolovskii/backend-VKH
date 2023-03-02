import * as bcrypt from 'bcrypt';

export const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.CRYPT_SALT as string, 10));
  const hash = await bcrypt.hash(password, salt);
  return hash;
};