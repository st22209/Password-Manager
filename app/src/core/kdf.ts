import { AES, enc } from "crypto-ts";
import { genSalt, hash } from "bcrypt-ts";
import { Store } from "tauri-plugin-store-api";

async function bcrypt_hash(input: string, salt: string | null = null): Promise<{ hash: string; salt: string; }> {
    if (salt === null) {
        salt = await genSalt()
    }
    let hashed = await hash(input, salt)
    return { hash: hashed, salt }
}

function encrypt(input: string, key: string) {
    return AES.encrypt(input, key).toString();
}

function decrypt(encrypted_input: string, key: string) {
    return AES.decrypt(encrypted_input, key).toString(enc.Utf8)
}

async function getUserKeys(
    username: string,
    password: string,
): Promise<Array<{ hash: string, salt: string }>> {
    let store = new Store("salts.dat");

    let vaultSalt: string | null = await store.get(`${username}-vault-salt`);
    let authSalt: string | null = await store.get(`${username}-auth-salt`);

    if (vaultSalt === null || authSalt === null) {
        let vaultKey = await bcrypt_hash(`${password}${username}`);
        let authKey = await bcrypt_hash(`${vaultKey.hash}${username}`);

        await store.set(`${username}-vault-salt`, vaultKey.salt);
        await store.set(`${username}-auth-salt`, authKey.salt);

        vaultSalt = vaultKey.salt
        authSalt = authKey.salt
    }

    let vaultKey = await bcrypt_hash(`${password}${username}`, vaultSalt);
    let authKey = await bcrypt_hash(`${vaultKey.hash}${username}`, authSalt);

    return [vaultKey, authKey]
}

export {
    bcrypt_hash, getUserKeys, encrypt, decrypt
}