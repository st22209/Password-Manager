import { useState } from "react"
import { save, open } from "@tauri-apps/api/dialog"
import { invoke } from "@tauri-apps/api/tauri"
import { createBackup, decryptBackupData } from "../core"
import { readTextFile } from "@tauri-apps/api/fs"
import { encrypt, bcrypt_hash } from "../core"
import { postNewPassword } from "../core"
import { Keys, ErrorMessage } from "../core/types"
import { motion } from "framer-motion"

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

    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
        title: "",
        body: "",
    })

    return (
        <motion.div
            animate={{
                opacity: 1,
                transition: {
                    ease: "easeInOut",
                    delay: 0.2,
                    duration: 0.75,
                },
            }}
            initial={{
                opacity: 0,
            }}
        >
            {showErrorMessage && (
                <div className="z-40 absolute top-10 right-10 shadow-2xl">
                    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                        {errorMessage.title}
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                        <p>{errorMessage.body}</p>
                    </div>
                </div>
            )}

            <div className="h-screen w-full items-center justify-center">
                <div className="grid grid-cols-2 h-full">
                    <form
                        className="p-5 grid h-screen place-items-center border-r-2 border-black"
                        onSubmit={async (e) => {
                            e.preventDefault()

                            let backupData = await createBackup(
                                user.id,
                                user.username,
                                encryptionPassword,
                                keys.vault.hash,
                                keys.auth.hash
                            )
                            if (typeof backupData === "string") {
                                await saveFileContents(backupData)
                            }
                        }}
                    >
                        <div className="flex flex-col items-center gap-10">
                            <h1 className="text-2xl font-bold">Backup Data</h1>
                            <div className="flex items-center border-b border-[#525BA9] py-2">
                                <input
                                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                    type="text"
                                    required
                                    onChange={(e) =>
                                        setEncryptionPassword(e.target.value)
                                    }
                                    placeholder="Enter Encryption Password"
                                />
                                <button
                                    className="flex-shrink-0 bg-[#525BA9] hover:bg-purple-700 border-[#525BA9] hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="submit"
                                >
                                    Choose File
                                </button>
                            </div>
                        </div>
                    </form>
                    <form
                        className="p-5 grid h-screen place-items-center border-r-2 border-black"
                        onSubmit={async (e) => {
                            e.preventDefault()
                            const savePath = await open({ multiple: false })
                            if (!savePath) {
                                return
                            }
                            let contents = await readTextFile(
                                savePath as string
                            )
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
                                setShowErrorMessage(true)
                                setErrorMessage({
                                    title: "Failed to restore from backup",
                                    body: "Most likely because the decryption password is incorrect",
                                })
                                setTimeout(
                                    () => setShowErrorMessage(false),
                                    5000
                                )
                            }
                        }}
                    >
                        <div className="flex flex-col items-center gap-10">
                            <h1 className="text-2xl font-bold">Restore Data</h1>
                            <div className="flex items-center border-b border-[#525BA9] py-2">
                                <input
                                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                    type="text"
                                    required
                                    placeholder="Enter Decryption Password"
                                    onChange={(e) =>
                                        setDecryptionPassword(e.target.value)
                                    }
                                />
                                <button
                                    className="flex-shrink-0 bg-[#525BA9] hover:bg-purple-700 border-[#525BA9] hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="submit"
                                >
                                    Choose File
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

export default BackupVault
