import React from "react"
import { useState } from "react"
import {
    postNewPassword,
    encrypt,
    bcrypt_hash,
    runValidationPassword,
} from "../core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import generator from "generate-password-ts"
import { writeText } from "@tauri-apps/api/clipboard"
import { Keys, ErrorMessage } from "../core/types"
import { motion, AnimatePresence } from "framer-motion"

const PasswordForm = ({
    show,
    setStateFunction,
    keys,
    owner_id,
}: {
    show: boolean
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>
    keys: Keys
    owner_id: string
}) => {
    const [title, setTitle] = useState("")
    const [username, setUsername] = useState("")
    const [websiteURL, setWebsiteURL] = useState("")
    const [password, setPassword] = useState("")
    const [note, setNote] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [websiteIconURL, setWebsiteIconURL] = useState("")

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

    function resetInputFields() {
        setTitle("")
        setUsername("")
        setWebsiteURL("")
        setPassword("")
        setNote("")
        setWebsiteIconURL("")
        setShowPassword(false)
    }

    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
        title: "",
        body: "",
    })

    return (
        <>
            <AnimatePresence>
                {showErrorMessage && (
                    <motion.div
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                                ease: "easeInOut",
                                delay: 1,
                            },
                        }}
                        initial={{
                            opacity: 0,
                            x: 100,
                        }}
                        exit={{ opacity: 0 }}
                        className="z-[50] absolute top-10 right-10 shadow-2xl"
                    >
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            {errorMessage.title}{" "}
                            <button
                                className="float-right"
                                onClick={() => {
                                    setShowErrorMessage(false)
                                }}
                            >
                                X
                            </button>
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            <p>{errorMessage.body}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {show && (
                    <motion.div
                        className="z-40 w-[75vw] h-[90vh] bg-white shadow-2xl rounded-2xl p-3 absolute left-[15%] top-[7%] overflow-y-auto"
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                ease: "easeInOut",
                                delay: 1,
                            },
                        }}
                        initial={{
                            opacity: 0,
                            y: 100,
                        }}
                        exit={{ opacity: 0 }}
                    >
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
                                    return
                                }
                                let key = await bcrypt_hash(keys.vault.hash)
                                let encrypted_password = encrypt(
                                    password,
                                    key.hash
                                )
                                let res = await postNewPassword(
                                    keys.auth.hash,
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
                                    return
                                }
                                setShowErrorMessage(false)
                                resetInputFields()
                                setStateFunction(false)
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Title
                                    <span className="ml-1 text-red-600">*</span>
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
                                    <span className="ml-1 text-red-600">*</span>
                                </label>
                                <input
                                    maxLength={64}
                                    placeholder="Enter the email or username for this account/website"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    value={username}
                                    className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Website URL
                                    <span className="ml-1 text-red-600">*</span>
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
                                    <span className="ml-1 text-red-600">*</span>
                                </label>
                                <div className="flex">
                                    <input
                                        value={password}
                                        placeholder="Enter Password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
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
                                        type="button"
                                        className="float-right mx-4 text-red-500"
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
                                    Add Password
                                </button>
                                <button
                                    onClick={() => {
                                        resetInputFields()
                                        setStateFunction(false)
                                    }}
                                    type="button"
                                    className="px-12 py-2 tracking-wide  text-white transition-colors duration-200 transform bg-[#333333] rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default PasswordForm
