import bcrypt from 'bcrypt';
import Encrypt from '../../useCase/interface/encryptPassword'


class EncryptPassword implements Encrypt {
    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    }
}

export default EncryptPassword;