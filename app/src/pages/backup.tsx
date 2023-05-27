import { useState } from "react"
import { save, open } from "@tauri-apps/api/dialog"
import { invoke } from "@tauri-apps/api/tauri"
import { createBackup, decryptBackupData } from "../core"
import { readTextFile } from "@tauri-apps/api/fs"
import { encrypt, bcrypt_hash } from "../core"
import { postNewPassword } from "../core"
import { Keys } from "../core/types"

async function saveFileContents(data: string) {
    try {
        const savePath = await save()
        if (!savePath) {
            return
        }
        await invoke("save_file", {
            path: savePath,
            contents: data,
        })
    } catch (err) {
        console.error(err)
    }
}

const BackupVault = ({
    user,
    keys,
}: {
    user: {
        id: string
        username: string
        auth_key_hash: string
    }
    keys: Keys
}) => {
    const [encryptionPassword, setEncryptionPassword] = useState("")
    const [decryptionPassword, setDecryptionPassword] = useState("")

    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault()

                    let backupData = await createBackup(
                        user.id,
                        user.username,
                        encryptionPassword,
                        keys.vault.hash,
                        keys.auth.hash
                    )
                    if (typeof backupData === "string")
                        await saveFileContents(backupData)
                }}
            >
                <input
                    type="text"
                    onChange={(e) => setEncryptionPassword(e.target.value)}
                />
                <button type="submit">ee</button>
            </form>
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    const savePath = await open({ multiple: false })
                    if (!savePath) {
                        return
                    }
                    let contents = await readTextFile(savePath as string)
                    try {
                        let data: Array<{
                            name: string
                            username: string
                            password: string
                            url: string
                            note: string
                            date_added: string
                            last_edited: string
                        }> = await decryptBackupData(
                            contents,
                            decryptionPassword
                        )
                        data.forEach(async (password) => {
                            let key = await bcrypt_hash(keys.vault.hash)
                            let encrypted_password = encrypt(
                                password.password,
                                key.hash
                            )

                            await postNewPassword(keys.auth.hash, {
                                name: password.name,
                                username: password.username,
                                password: encrypted_password,
                                salt: key.salt,
                                url: password.url,
                                note: password.note,
                                owner_id: user.id,
                            })
                        })
                    } catch {
                        return console.log("fail")
                    }
                }}
            >
                <input
                    type="text"
                    onChange={(e) => setDecryptionPassword(e.target.value)}
                />
                <button type="submit">ee</button>
            </form>
        </div>
    )
}

export default BackupVault
