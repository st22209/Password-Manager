import React from "react"
import { useState, useEffect } from "react"
import {
    editPassword,
    encrypt,
    decrypt,
    bcrypt_hash,
    runValidationPassword,
} from "../core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import generator from "generate-password-ts"
import { writeText } from "@tauri-apps/api/clipboard"
import { Password, Keys, ErrorMessage } from "../core/types"

const EditPasswordForm = ({
    show,
    setStateFunction,
    keys,
    owner_id,
    passwordData,
}: {
    show: boolean
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>
    keys: Keys
    owner_id: string
    passwordData: Password
}) => {
    const [title, setTitle] = useState(passwordData.name)
    const [username, setUsername] = useState(passwordData.username)
    const [websiteURL, setWebsiteURL] = useState(passwordData.url)

    useEffect(() => {
        bcrypt_hash(keys.vault.hash, passwordData.salt).then((key) => {
            setPassword(decrypt(passwordData.password, key.hash))
        })
    }, [])

    const [password, setPassword] = useState(passwordData.password)
    const [note, setNote] = useState(passwordData.note)
    const [showPassword, setShowPassword] = useState(false)
    const [websiteIconURL, setWebsiteIconURL] = useState(websiteURL)

    let fetchURLTimeout: NodeJS.Timeout

    const startTypingURL = () => {
        clearTimeout(fetchURLTimeout)
        fetchURLTimeout = setTimeout(() => {
            setWebsiteIconURL(websiteURL)
        }, 5000)
    }
    const stopTypingURL = () => {
        clearTimeout(fetchURLTimeout)
    }

    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
        title: "",
        body: "",
    })

    return (
        <>
            {showErrorMessage && (
                <div className="z-[100] absolute top-10 right-10 shadow-2xl">
                    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                        {errorMessage.title}
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                        <p>{errorMessage.body}</p>
                    </div>
                </div>
            )}
            {show && (
                <div className="z-40 w-[75vw] h-[90vh] bg-white shadow-2xl rounded-2xl p-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto">
                    <div className="w-full items-center justify-center flex mt-5">
                        <img
                            className="w-20"
                            src={`https://www.google.com/s2/favicons?domain=${websiteIconURL}&sz=256`}
                            alt=""
                        />
                    </div>
                    <form
                        className="m-5"
                        onSubmit={async (e) => {
                            e.preventDefault()

                            let validation = runValidationPassword(
                                password,
                                websiteURL
                            )
                            if (!validation.success) {
                                setShowErrorMessage(true)
                                setErrorMessage({
                                    title: validation.error.title,
                                    body: validation.error.body,
                                })
                                setTimeout(
                                    () => setShowErrorMessage(false),
                                    5000
                                )
                                return
                            }

                            let key = await bcrypt_hash(keys.vault.hash)
                            let encrypted_password = encrypt(password, key.hash)

                            let res = await editPassword(
                                keys.auth.hash,
                                passwordData.id,
                                {
                                    name: title,
                                    username,
                                    password: encrypted_password,
                                    salt: key.salt,
                                    url: websiteURL,
                                    note,
                                    owner_id,
                                }
                            )
                            if (!res.success) {
                                setShowErrorMessage(true)
                                setErrorMessage({
                                    title: res.error.title,
                                    body: res.error.body,
                                })
                                setTimeout(
                                    () => setShowErrorMessage(false),
                                    5000
                                )
                                return
                            }
                            setShowErrorMessage(false)
                            setStateFunction(false)
                        }}
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-800">
                                Title
                            </label>
                            <input
                                maxLength={32}
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                placeholder="Enter Name/Title"
                                className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-800">
                                Email/Username
                            </label>
                            <input
                                maxLength={64}
                                placeholder="Enter the email or username for this account/website"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-800">
                                Website URL
                            </label>
                            <input
                                onChange={async (e) =>
                                    setWebsiteURL(e.target.value)
                                }
                                onKeyUp={startTypingURL}
                                onKeyDown={stopTypingURL}
                                value={websiteURL}
                                max={2048}
                                placeholder="Enter Website URL"
                                className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-800">
                                Password
                            </label>
                            <div className="flex">
                                <input
                                    value={password}
                                    placeholder="Enter Password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="float-right ml-4"
                                >
                                    {showPassword ? (
                                        <FontAwesomeIcon
                                            icon={"fa-solid fa-eye" as any}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={
                                                "fa-solid fa-eye-slash" as any
                                            }
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={async () => {
                                        let genPswd = generator.generate({
                                            strict: true,
                                            length: 20,
                                            excludeSimilarCharacters: true,
                                            symbols: true,
                                            numbers: true,
                                        })
                                        setPassword(genPswd)
                                        await writeText(genPswd)
                                    }}
                                    type="button"
                                    className="float-right mx-4 text-red-500"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-800">
                                Description/Note
                            </label>
                            <textarea
                                value={note}
                                placeholder="Enter a short description or note (This is optional)"
                                maxLength={2000}
                                onChange={(e) => setNote(e.target.value)}
                                className="placeholder:opacity-50 resize-none px-4 h-40 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                            />
                            <p className="text-[#AAAAAA] float-right font-extralight text-sm">
                                Max. 2000 characters
                            </p>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#1F81B9] rounded-md"
                            >
                                Edit Password
                            </button>
                            <button
                                onClick={() => {
                                    setStateFunction(false)
                                }}
                                type="button"
                                className="px-12 py-2 tracking-wide  text-white transition-colors duration-200 transform bg-[#333333] rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default EditPasswordForm
