import { useState } from "react"
import { generate } from "generate-password-ts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { writeText } from "@tauri-apps/api/clipboard"
import { motion } from "framer-motion"

const GeneratePassword = () => {
    const [generatedPassword, setGeneratedPassword] = useState("")
    const [passwordOptions, setPasswordOptions] = useState<{
        length: number
        numbers: boolean
        symbols: boolean
        uppercase: boolean
        lowercase: boolean
        excludeSimilarCharacters: boolean
        strict: boolean
    }>({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        excludeSimilarCharacters: true,
        strict: true,
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
            <div className="flex items-center justify-center mt-2">
                Note: all passwords entered into this manager require boxes 1-4
                + box 6 ticked
            </div>
            <h1 className="m-5 fixed bottom-0 "></h1>
            <div className="flex items-center justify-center h-screen ">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        setGeneratedPassword(generate(passwordOptions))
                    }}
                    className="bg-white rounded-lg shadow-xl w-[30rem] h-[40rem] flex flex-col items-center"
                >
                    <h1 className="font-bold text-[2.5rem] my-5 mt-10">
                        Password Generator
                    </h1>
                    <div>
                        <div className="flex mb-10 ">
                            <div className="overflow-y-scroll overflow-x-auto placeholder:opacity-50 resize-none px-4 h-25 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-[20rem] ">
                                {generatedPassword}
                            </div>
                            <button
                                type="button"
                                onClick={async () =>
                                    await writeText(generatedPassword)
                                }
                                className="float-right ml-4"
                            >
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-copy" as any}
                                />
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <div>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={passwordOptions.lowercase}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.lowercase = !clone.lowercase
                                            setPasswordOptions(clone)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-black">
                                        Allow Lowercase Characters
                                    </label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={passwordOptions.uppercase}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.uppercase = !clone.uppercase
                                            setPasswordOptions(clone)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-black">
                                        Allow Uppercase Characters
                                    </label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={passwordOptions.numbers}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.numbers = !clone.numbers
                                            setPasswordOptions(clone)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-black">
                                        Allow Numbers
                                    </label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={passwordOptions.symbols}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.symbols = !clone.symbols
                                            setPasswordOptions(clone)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-black">
                                        Allow Symbols
                                    </label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={
                                            passwordOptions.excludeSimilarCharacters
                                        }
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.excludeSimilarCharacters =
                                                !clone.excludeSimilarCharacters
                                            setPasswordOptions(clone)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-black">
                                        Exclude Similar Characters
                                    </label>
                                </div>
                                <div className="flex items-center mb-6">
                                    <input
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.strict = !clone.strict
                                            setPasswordOptions(clone)
                                        }}
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={passwordOptions.strict}
                                        value=""
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-black">
                                        Strict
                                    </label>
                                </div>
                                <label className="ml-2 text-sm font-medium text-black">
                                    Password Length
                                </label>
                                <div className="flex items-center mb-10 gap-5">
                                    <input
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.length = parseInt(
                                                e.target.value
                                            )
                                            setPasswordOptions(clone)
                                        }}
                                        type="range"
                                        min="12"
                                        className="cursor-ew-resize w-52 appearance-none rounded-full bg-gray-200 disabled:cursor-not-allowed"
                                    />
                                    <p className="w-2 ">
                                        {passwordOptions.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-bold px-7 py-2.5 float-right text-lg font-semibold rounded bg-[#505BAF] text-white"
                    >
                        Generate
                    </button>
                </form>
            </div>
        </motion.div>
    )
}

export default GeneratePassword
