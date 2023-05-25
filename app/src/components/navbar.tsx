import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

const Navbar = ({
    page,
    setPage,
}: {
    page: string
    setPage: React.Dispatch<React.SetStateAction<"all" | "generate" | "backup">>
}) => {
    const navigate = useNavigate()

    return (
        <div className="h-full w-[25vw]">
            <div>
                <div className="p-5 w-full text-center h-full mt-10">
                    <div className="p-2.5 mt-1 flex items-center">
                        <h1 className="text-[3rem] ml-3 text-gray-200 font-bold">
                            Password1
                        </h1>
                    </div>

                    <div className="text-xl text-white mt-5">
                        <button
                            onClick={() => setPage("all")}
                            className={
                                page === "all"
                                    ? "my-1 w-full p-5 flex items-center rounded-md cursor-pointer bg-[#505BAF]"
                                    : "my-1 w-full p-5 flex items-center rounded-md duration-300 cursor-pointer hover:bg-[#505BAF]"
                            }
                        >
                            <FontAwesomeIcon
                                className="opacity-75"
                                icon={"fa-solid fa-list" as IconProp}
                            />
                            <span className="ml-4 opacity-75">
                                All Passwords
                            </span>
                        </button>

                        <button
                            onClick={() => setPage("generate")}
                            className={
                                page === "generate"
                                    ? "my-1 w-full p-5 flex items-center rounded-md cursor-pointer bg-[#505BAF]"
                                    : "my-1 w-full p-5 flex items-center rounded-md duration-300 cursor-pointer hover:bg-[#505BAF]"
                            }
                        >
                            <FontAwesomeIcon
                                className="opacity-75"
                                // @ts-ignore
                                icon={["fa-solid", "fa-lock"]}
                            />
                            <span className="ml-4 opacity-75">
                                Password Generator
                            </span>
                        </button>

                        <button
                            onClick={() => setPage("backup")}
                            className={
                                page === "backup"
                                    ? "my-1 w-full p-5 flex items-center rounded-md cursor-pointer bg-[#505BAF]"
                                    : "my-1 w-full p-5 flex items-center rounded-md duration-300 cursor-pointer hover:bg-[#505BAF]"
                            }
                        >
                            <FontAwesomeIcon
                                className="opacity-75"
                                // @ts-ignore
                                icon={["fa-solid", "fa-floppy-disk"]}
                            />
                            <span className="ml-4 opacity-75">
                                Backup Vault
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="my-1 w-full p-5 flex items-center rounded-md duration-300 cursor-pointer hover:bg-[#505BAF]"
                        >
                            <FontAwesomeIcon
                                className="opacity-75"
                                // @ts-ignore
                                icon={["fa-solid", "fa-home"]}
                            />
                            <span className="ml-4 opacity-75">Logout/Home</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
