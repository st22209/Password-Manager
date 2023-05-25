import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { getUserKeys, authGetUser } from "../core"
import { useNavigate } from "react-router-dom"

type ErrorMessage = {
    title: string
    body: string
}

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
        title: "",
        body: "",
    })

    return (
        <div>
            <div className="absolute w-full h-full bg-user-background bg-cover"></div>

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

            <Link className="absolute z-20 top-5 left-5 text-white" to="/">
                Back To Home
            </Link>

            <div className="flex flex-col h-screen justify-center items-center relative z-10">
                <h1 className="text-bold text-white text-[5rem]">Login</h1>
                <div>
                    <form
                        onSubmit={async (
                            e: React.FormEvent<HTMLFormElement>
                        ) => {
                            e.preventDefault()

                            let keys = await getUserKeys(username, password)
                            let authKey = keys.auth.hash

                            let userValid = await authGetUser(username, authKey)

                            if (userValid.success) {
                                return navigate("/passwords", {
                                    state: {
                                        user: userValid.user,
                                        keys,
                                    },
                                })
                            }
                            setShowErrorMessage(true)
                            setErrorMessage({
                                title: userValid.error.title,
                                body: userValid.error.body,
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
                            type="password"
                            value={password}
                            placeholder="Master Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></input>
                        <br />
                        <div className="flex flex-col justify-center items-center">
                            <button
                                type="submit"
                                className="py-3 text-center w-full text-lg font-semibold rounded bg-[#505BAF] text-white"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
