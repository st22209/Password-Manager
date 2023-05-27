import { PasswordForm, PasswordTable } from "../components"
import { useEffect, useState } from "react"
import { getPassword } from "../core"
import { Keys, Password } from "../core/types"

const AllPasswords = ({
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
    const [showModal, setShowModal] = useState<boolean>(false)
    const [passwords, setPasswords] = useState<Password[]>([])

    useEffect(() => {
        const fetchData = async () => {
            let data = await getPassword(user.id, keys.auth.hash)
            if (data.success) {
                setPasswords(data.passwords)
            }
        }
        fetchData()
        const loop = setInterval(fetchData, 3e3)
        return () => clearInterval(loop)
    }, [])

    return (
        <div>
            <PasswordForm
                show={showModal}
                setStateFunction={setShowModal}
                keys={keys}
                owner_id={user.id}
            />

            <div className="p-10 flex-col flex">
                <div>
                    <h1 className="font-bold text-[2rem] float-left mb-5">
                        All Passwords
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-bold px-7 py-2.5 float-right text-lg font-semibold rounded bg-[#505BAF] text-white"
                    >
                        New Password
                    </button>
                </div>
                <div className="mt-5">
                    <PasswordTable
                        passwords={passwords}
                        data={{ user, keys }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AllPasswords
