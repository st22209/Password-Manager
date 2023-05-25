import { useState } from "react"
import { Navbar } from "../components"
import { Link } from "react-router-dom"
import { GeneratePassword, AllPasswords, BackupVault } from "./"
import { useLocation } from "react-router-dom"

const Passwords = () => {
    type Keys = {
        vault: { hash: string; salt: string }
        auth: { hash: string; salt: string }
    }

    const location = useLocation()
    const data: {
        user: {
            id: string
            username: string
            auth_key_hash: string
        }
        keys: Keys
    } = location.state

    if (data.user == null || data.keys == null) {
        return (
            <div className="text-white">
                <h1>ERROR PLEASE LOGIN</h1>
                <Link className="absolute z-20 top-5 left-5 text-white" to="/">
                    Back To Home
                </Link>
            </div>
        )
    }

    const pages = {
        all: <AllPasswords user={data.user} keys={data.keys} />,
        generate: <GeneratePassword />,
        backup: <BackupVault />,
    }
    const [currentPage, setCurrentPage] = useState<
        "all" | "generate" | "backup"
    >("all")

    return (
        <div>
            <div
                style={{ gridTemplateColumns: "25vw 75vw" }}
                className="grid grid-cols-2 w-screen h-screen"
            >
                <Navbar page={currentPage} setPage={setCurrentPage} />
                <div className="bg-white overflow-y-auto">
                    {pages[currentPage]}
                </div>
            </div>
        </div>
    )
}

export default Passwords
