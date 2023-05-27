import { getPassword } from "./requests";
import { bcrypt_hash, encrypt, decrypt } from "./kdf";
import { Store } from "tauri-plugin-store-api";

/*
the bcrypt function needs a salt but I dont need i so 
im making this constant to use the same salt each time 
*/
const BACKUP_PEPPER = "$2a$10$nzz9zwFAD.6j02TTA96TgO"


async function createBackup(userID: string, username: string, password: string, vaultKey: string, authKey: string) {
    let data = await getPassword(userID, authKey)
    if (!data.success) {
        return
    }

    let backupData: Array<{
        name: string;
        username: string;
        password: string;
        url: string;
        note: string;
        date_added: string;
        last_edited: string;
    }> = []

    for (let pswd of data.passwords) {
        let key = await bcrypt_hash(
            vaultKey,
            pswd.salt
        )

        let pswdData = {
            name: pswd.name,
            username: pswd.username,
            password: decrypt(
                pswd.password,
                key.hash
            ),
            url: pswd.url,
            note: pswd.note,
            date_added: pswd.date_added,
            last_edited: pswd.last_edited,
        }
        backupData.push(pswdData)
    }

    return encrypt(JSON.stringify(backupData), (await bcrypt_hash(password, BACKUP_PEPPER)).hash)
}

async function decryptBackupData(data: string, password: string) {
    let key = (await bcrypt_hash(password, BACKUP_PEPPER)).hash
    let decrypted = decrypt(data, key)
    return JSON.parse(decrypted)
}

export {
    createBackup,
    decryptBackupData
}
