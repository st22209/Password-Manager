import React from "react";
import { Link } from "react-router-dom";

type UserFormProps = {
	title: string;
	submitCallback: (e: React.FormEvent<HTMLFormElement>) => void;
};
const UserForm = ({ title, submitCallback }: UserFormProps) => {
	return (
		<div>
			<div className="absolute w-full h-full bg-user-background bg-cover"></div>
			<Link className="absolute z-20 top-5 left-5 text-white" to="/">
				Back To Home
			</Link>
			<div className="flex flex-col h-screen justify-center items-center relative z-10">
				<h1 className="text-bold text-white text-[5rem]">{title}</h1>
				<div>
					<form onSubmit={submitCallback}>
						<input
							className="bg-transparent w-full py-4 px-1 leading-tight focus:outline-none border-b-2 border-white text-[1.2rem] text-[#999999] mb-3"
							type="text"
							placeholder="Username"
						></input>
						<input
							className="bg-transparent w-full py-4 px-1 leading-tight focus:outline-none border-b-2 border-white text-[1.2rem] text-[#999999] mb-10"
							type="text"
							placeholder="Master Password"
						></input>
						<br />
						<div className="flex flex-col justify-center items-center">
							<button
								type="submit"
								className="py-3 text-center w-full text-lg font-semibold rounded bg-[#505BAF] text-white"
							>
								{title}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UserForm;
