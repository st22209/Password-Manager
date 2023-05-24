import { useState } from "react";
import { Navbar } from "../components";
import { useSearchParams, Link } from "react-router-dom";
import { GeneratePassword, AllPasswords, BackupVault } from "./";

const Passwords = () => {
	const [searchParams, _setSearchParams] = useSearchParams();

	const userId = searchParams.get("user");
	const authKey = searchParams.get("auth");

	if (userId == null || authKey == null) {
		return (
			<div className="text-white">
				<h1>ERROR PLEASE LOGIN</h1>
				<Link className="absolute z-20 top-5 left-5 text-white" to="/">
					Back To Home
				</Link>
			</div>
		);
	}

	const pages = {
		all: <AllPasswords />,
		generate: <GeneratePassword />,
		backup: <BackupVault />,
	};
	const [currentPage, setCurrentPage] = useState<
		"all" | "generate" | "backup"
	>("all");

	return (
		<div>
			<div className="flex w-screen h-screen">
				<Navbar page={currentPage} setPage={setCurrentPage} />
				<div className="bg-white w-[75vw] h-full">
					{pages[currentPage]}
				</div>
			</div>
		</div>
	);
};

export default Passwords;
