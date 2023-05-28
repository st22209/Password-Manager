import { useState } from "react"
import { Navbar } from "../components"
import { Link } from "react-router-dom"
import { GeneratePassword, AllPasswords, BackupVault } from "./"
import { useLocation } from "react-router-dom"
import { Keys } from "../core/types"
import { motion } from "framer-motion"

const Passwords = () => {
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
        backup: <BackupVault user={data.user} keys={data.keys} />,
    }
    const [currentPage, setCurrentPage] = useState<
        "all" | "generate" | "backup"
    >("all")

    return (
        <div>
            <div
                style={{ gridTemplateColumns: "25vw 75vw" }}
                className="grid grid-cols-2 w-screen h-screen overflow-x-hidden overflow-y-auto"
            >
                <motion.div
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                            ease: "easeInOut",
                            delay: 0.2,
                            duration: 0.75,
                        },
                    }}
                    initial={{
                        opacity: 0,
                        x: -100,
                    }}
                >
                    <Navbar page={currentPage} setPage={setCurrentPage} />
                </motion.div>
                <motion.div
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                            ease: "easeInOut",
                            delay: 0.2,
                            duration: 0.75,
                        },
                    }}
                    initial={{
                        opacity: 0,
                        x: 100,
                    }}
                    className="bg-white"
                >
                    {pages[currentPage]}
                </motion.div>
            </div>
        </div>
    )
}

export default Passwords
