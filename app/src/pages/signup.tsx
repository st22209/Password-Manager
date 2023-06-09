import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { runValidation, getUserKeys, signupSubmitCallback } from "../core"
import { ErrorMessage } from "../core/types"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Signup = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
        title: "",
        body: "",
    })

    function resetFields() {
        setUsername("")
        setPassword("")
    }

    return (
        <div>
            <div className="absolute w-full h-full bg-user-background bg-cover"></div>

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
                        className="z-40 absolute top-10 right-10 shadow-2xl"
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

            <Link className="absolute z-20 top-5 left-5 text-white" to="/">
                Back To Home
            </Link>

            <motion.div
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        ease: "easeInOut",
                        delay: 0.1,
                        duration: 0.75,
                    },
                }}
                initial={{
                    opacity: 0,
                    y: 100,
                }}
                className="flex flex-col h-screen justify-center items-center relative z-10"
            >
                <h1 className="text-bold text-white text-[5rem] font-poppins">
                    Signup
                </h1>
                <div className="flex">
                    <form
                        onSubmit={async (
                            e: React.FormEvent<HTMLFormElement>
                        ) => {
                            e.preventDefault()

                            // run validation function on username and password
                            let valid = runValidation(username, password)
                            if (!valid.success) {
                                setShowErrorMessage(true)
                                return setErrorMessage({
                                    title: valid.error.title,
                                    body: valid.error.body,
                                })
                            }

                            // run function to create new user with api and gen salt
                            let data = await signupSubmitCallback(
                                username,
                                password
                            )

                            if (data.success) {
                                resetFields()
                                let keys = await getUserKeys(username, password)
                                return navigate("/passwords", {
                                    state: {
                                        user: data.user,
                                        keys: keys,
                                    },
                                })
                            }

                            // handle error from api
                            setShowErrorMessage(true)
                            setErrorMessage({
                                title: data.error.title,
                                body: data.error.body,
                            })
                        }}
                    >
                        <input
                            className="bg-transparent w-full py-4 px-1 leading-tight focus:outline-none border-b-2 border-white text-[1.2rem] text-[#999999] mb-3"
                            type="text"
                            value={username}
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        ></input>

                        <input
                            className="bg-transparent w-full py-4 px-1 leading-tight focus:outline-none border-b-2 border-white text-[1.2rem] text-[#999999] mb-10"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            placeholder="Master Password"
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (
                                    e.target.value.toLowerCase() ===
                                    "iloverickastley"
                                ) {
                                    window.location.replace(
                                        "https://youtu.be/dQw4w9WgXcQ"
                                    )
                                }
                            }}
                            required
                            minLength={12}
                        ></input>

                        <br />

                        <div className="flex flex-col justify-center items-center">
                            <button
                                type="submit"
                                className="py-3 text-center w-full text-lg font-semibold rounded bg-[#505BAF] text-white"
                            >
                                Signup!
                            </button>
                        </div>
                    </form>
                    <div className="flex mb-7">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-white"
                        >
                            {showPassword ? (
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-eye" as any}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-eye-slash" as any}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup
