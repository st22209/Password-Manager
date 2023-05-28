import { decrypt, bcrypt_hash, deletePassword } from "../core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { useState } from "react"
import { EditPasswordForm } from "../components"
import { writeText } from "@tauri-apps/api/clipboard"
import { Password, Keys } from "../core/types"
import { motion, AnimatePresence } from "framer-motion"

type passwordViewModalType = {
    show: boolean
    data?: Password
    decrypted?: string
}

const PasswordTable = ({
    passwords,
    data,
}: {
    passwords: Password[]
    data: {
        user: {
            id: string
            username: string
            auth_key_hash: string
        }
        keys: Keys
    }
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordViewModal, setPasswordViewModal] =
        useState<passwordViewModalType>({ show: false })
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <div>
            <AnimatePresence>
                {passwordViewModal.show &&
                    passwordViewModal.data !== undefined &&
                    passwordViewModal.decrypted !== undefined && (
                        <motion.div
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
                            className="z-40 w-[75vw] h-[90vh] bg-white shadow-2xl rounded-2xl p-3 absolute left-[15%] top-[7%] overflow-y-auto"
                        >
                            <div className="w-full items-center justify-center flex flex-col mt-5">
                                <img
                                    className="w-20"
                                    src={`https://www.google.com/s2/favicons?domain=${passwordViewModal.data.url}&sz=256`}
                                    alt=""
                                />
                                <div className="flex-col w-full">
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Title
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {passwordViewModal.data.name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.data
                                                            ?.name as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Email/Username
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {
                                                    passwordViewModal.data
                                                        .username
                                                }
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.data
                                                            ?.username as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Website URL
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {passwordViewModal.data.url}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.data
                                                            ?.url as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Password
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {showPassword
                                                    ? passwordViewModal.decrypted
                                                    : "•".repeat(
                                                          passwordViewModal
                                                              .decrypted.length
                                                      )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                {showPassword ? (
                                                    <FontAwesomeIcon
                                                        icon={
                                                            "fa-solid fa-eye" as any
                                                        }
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
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.decrypted as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Date Added
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {new Date(
                                                    passwordViewModal.data.date_added
                                                ).toLocaleString("en-NZ")}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.data
                                                            ?.date_added as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Last Modified
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {new Date(
                                                    passwordViewModal.data.last_edited
                                                ).toLocaleString("en-NZ")}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.data
                                                            ?.last_edited as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Description/Note
                                        </label>
                                        <div className="flex">
                                            <div className="placeholder:opacity-50 resize-none px-4 h-40 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-full">
                                                {passwordViewModal.data.note}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () =>
                                                    await writeText(
                                                        passwordViewModal.data
                                                            ?.note as string
                                                    )
                                                }
                                                className="float-right ml-4"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        "fa-solid fa-copy" as any
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 ">
                                    <button
                                        onClick={() => {
                                            setPasswordViewModal({
                                                show: false,
                                            })
                                        }}
                                        type="button"
                                        className="px-12 py-2 tracking-wide  text-white transition-colors duration-200 transform bg-[#333333] rounded-md"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
            </AnimatePresence>

            <div className="flex flex-col ">
                <div className=" sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div>
                            <table className="min-w-full text-left text-sm font-light overflow-auto">
                                <thead className="border-b font-medium sticky top-0 bg-white w-full ">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">
                                            Icon
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Website
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Last Used
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Date Used
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passwords.map((password) => {
                                        return (
                                            <>
                                                <EditPasswordForm
                                                    show={showModal}
                                                    setStateFunction={
                                                        setShowModal
                                                    }
                                                    keys={data.keys}
                                                    owner_id={data.user.id}
                                                    passwordData={password}
                                                />

                                                <tr
                                                    key={password.id}
                                                    className="border-b font-poppins"
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4 w-24">
                                                        <img
                                                            src={`https://www.google.com/s2/favicons?domain=${password.url}&sz=256`}
                                                            alt="Website icon"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {password.name.slice(
                                                            0,
                                                            10
                                                        ) +
                                                            (password.name
                                                                .length > 10
                                                                ? "..."
                                                                : "")}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {password.url.slice(
                                                            0,
                                                            20
                                                        ) +
                                                            (password.url
                                                                .length > 20
                                                                ? "..."
                                                                : "")}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {new Date(
                                                            password.last_edited
                                                        ).toLocaleString(
                                                            "en-NZ"
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {new Date(
                                                            password.date_added
                                                        ).toLocaleString(
                                                            "en-NZ"
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap flex gap-2 px-6 py-4">
                                                        <button
                                                            onClick={async () => {
                                                                let key =
                                                                    await bcrypt_hash(
                                                                        data
                                                                            .keys
                                                                            .vault
                                                                            .hash,
                                                                        password.salt
                                                                    )

                                                                setPasswordViewModal(
                                                                    {
                                                                        show: true,
                                                                        data: password,
                                                                        decrypted:
                                                                            decrypt(
                                                                                password.password,
                                                                                key.hash
                                                                            ),
                                                                    }
                                                                )
                                                            }}
                                                            className="text-bold px-4 py-2.5 rounded bg-green-600 text-white"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    "fa-solid fa-eye" as IconProp
                                                                }
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                deletePassword(
                                                                    data.user
                                                                        .id,
                                                                    password.id,
                                                                    data.keys
                                                                        .auth
                                                                        .hash
                                                                )
                                                            }}
                                                            className="text-bold px-4 py-2.5 rounded bg-red-500 text-white"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    "fa-solid fa-trash" as IconProp
                                                                }
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowModal(
                                                                    true
                                                                )
                                                            }}
                                                            className="text-bold px-4 py-2.5 rounded bg-blue-500 text-white"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    "fa-solid fa-edit" as IconProp
                                                                }
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordTable
