import { useState, useEffect } from "react"
import { generate } from "generate-password-ts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { writeText } from "@tauri-apps/api/clipboard"
import { motion } from "framer-motion"

const GeneratePassword = () => {
    useEffect(() => setGeneratedPassword(generate(passwordOptions)), [])

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
                    className="bg-[#848fec] rounded-lg shadow-2xl p-10  flex flex-col items-center"
                >
                    <div>
                        <div className="flex mb-5">
                            <div className="px-3 py-1 bg-[#202320]  rounded-md flex gap-2">
                                <div className="overflow-y-scroll overflow-x-auto placeholder:opacity-50 resize-none p-2 h-14 mt-2 text-white focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 w-[20rem] ">
                                    {generatedPassword}
                                </div>
                                <button
                                    type="button"
                                    onClick={async () =>
                                        await writeText(generatedPassword)
                                    }
                                    className="float-right ml-4 text-white text-2xl"
                                >
                                    <FontAwesomeIcon
                                        icon={"fa-solid fa-copy" as any}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div>
                                <label className="m-2 text-md text-white font-bold">
                                    Password Length: {passwordOptions.length}
                                </label>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-10 py-5 rounded-lg">
                                    <p className="text-white font-bold text-lg font-poppins">
                                        12
                                    </p>
                                    <input
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.length = parseInt(
                                                e.target.value
                                            )
                                            setPasswordOptions(clone)
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="range"
                                        min="12"
                                        value={passwordOptions.length}
                                        max="32"
                                        className="w-52 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
                                    />
                                    <p className="text-white font-bold text-lg font-poppins">
                                        32
                                    </p>
                                </div>
                                <label className="mx-2 text-md text-white font-bold">
                                    Settings
                                </label>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-8 py-3 rounded-xl ">
                                    <input
                                        checked={passwordOptions.uppercase}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.uppercase = !clone.uppercase
                                            setPasswordOptions(clone)
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="checkbox"
                                        className="scale-150 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <p className="text-white font-bold text-md font-poppins ml-1">
                                        Allow Uppercase
                                    </p>
                                </div>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-8 py-3 rounded-xl ">
                                    <input
                                        checked={passwordOptions.lowercase}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.lowercase = !clone.lowercase
                                            setPasswordOptions(clone)
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="checkbox"
                                        className="scale-150 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <p className="text-white font-bold text-md font-poppins ml-1">
                                        Allow Lowercase
                                    </p>
                                </div>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-8 py-3 rounded-xl ">
                                    <input
                                        checked={passwordOptions.numbers}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.numbers = !clone.numbers
                                            setPasswordOptions(clone)
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="checkbox"
                                        className="scale-150 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <p className="text-white font-bold text-md font-poppins ml-1">
                                        Allow Numbers
                                    </p>
                                </div>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-8 py-3 rounded-xl ">
                                    <input
                                        checked={passwordOptions.symbols}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.symbols = !clone.symbols
                                            setPasswordOptions(clone)
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="checkbox"
                                        className="scale-150 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <p className="text-white font-bold text-md font-poppins ml-1">
                                        Allow Symbols
                                    </p>
                                </div>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-8 py-3 rounded-xl ">
                                    <input
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
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="checkbox"
                                        className="scale-150 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <p className="text-white font-bold text-md font-poppins ml-1">
                                        Exclude Similar Characters
                                    </p>
                                </div>
                                <div className="flex items-center mb-2 gap-3 bg-[#202320] px-8 py-3 rounded-xl ">
                                    <input
                                        checked={passwordOptions.strict}
                                        value=""
                                        onChange={(e) => {
                                            let clone =
                                                structuredClone(passwordOptions)
                                            clone.strict = !clone.strict
                                            setPasswordOptions(clone)
                                            setGeneratedPassword(
                                                generate(passwordOptions)
                                            )
                                        }}
                                        type="checkbox"
                                        className="scale-150 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <p className="text-white font-bold text-md font-poppins ml-1">
                                        Strict Mode
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <button
                        type="submit"
                        className="text-bold px-7 py-2.5 float-right text-lg font-semibold rounded bg-[#202320] text-white"
                    >
                        Generate
                    </button> */}
                </form>
            </div>
        </motion.div>
    )
}

export default GeneratePassword
