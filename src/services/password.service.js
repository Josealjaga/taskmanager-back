import pkg from 'bcryptjs';
const { hash, genSalt, compare } = pkg;


export async function encryptPassword(plain) {
  const salt = await genSalt(16);
  const encryptedPassword = await hash(plain, salt);

  return encryptedPassword;
}

export async function isValidPassword(plain, password) {
  return await compare(plain, password);
}