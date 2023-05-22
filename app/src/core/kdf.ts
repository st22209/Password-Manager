import { genSalt, hash } from "bcrypt-ts";

async function bcrypt_hash(input: string, salt: string | null = null): Promise<{ hash: string; salt: string; }> {
    if (salt === null) {
        salt = await genSalt()
    }
    let hashed = await hash(input, salt)
    return { hash: hashed, salt }
}

export {
    bcrypt_hash
}