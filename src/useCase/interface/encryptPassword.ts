

interface Encrypt{
    encryptPassword(password:string): Promise<string>;
    comparePassword(password:string, hashedPassword:string): Promise<boolean>;
}


export default Encrypt;