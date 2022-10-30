import * as bcrypt from "bcrypt";

/**
 * 입력받은 비밀번호에 bcrypt 알고리즘을 적용합니다. (비밀번호 암호화)
 *
 * @param plainText
 */
export const hash = async (plainText: string) => {
  const genSalt = 10;
  return await bcrypt.hash(plainText, genSalt);
};

/**
 * DB에 저장되어 있는 hashPassword와 입력받은 password를 비교합니다.
 *
 * @param password
 * @param hashPassword
 */
export const isHashValid = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};
