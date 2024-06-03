import * as bcrypt from 'bcrypt';

export namespace BcryptUtil {
  export const hash = async (plain: string) => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(plain, salt);
  };

  export const compare = async (plain: string, hashed: string) => {
    return bcrypt.compare(plain, hashed);
  };
}
