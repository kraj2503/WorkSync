import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt(10);
export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const verifyPassword = async (password: string, hash: string) => {
  const res = await bcrypt.compare(password, hash);
  return res;
};
