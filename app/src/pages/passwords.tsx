import { useParams } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "../components";
const Passwords = () => {
	const { user } = useParams();
	const pages = {
		all: <></>,
		generate: <></>,
		backup: <></>,
	};
	const [page, setPage] = useState("all");

	return (
		<div>

		<div className="flex w-screen h-screen">
			<Navbar page={page} setPage={setPage} />
			<div className="bg-white w-[75vw] h-full">ee</div>
		</div>
		</div>
	);
};

export default Passwords;
