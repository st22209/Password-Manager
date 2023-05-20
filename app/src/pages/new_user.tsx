import { Link } from "react-router-dom";
import { HeroVault } from "../assets";

const NewUser = () => {
	return (
		<div>
			<div className="p-5 lg:absolute text-[2rem] text-white font-bold">
				<h1>🗿 Password1™</h1>
			</div>
			<div className="flex flex-col h-screen justify-center items-center">
				<div className="container flex flex-col justify-center p-6 sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
					<div className="flex flex-col justify-center p-6 text-center rounded-sm lg:text-left">
						<h1 className="text-5xl font-bold sm:text-6xl lg:text-[2.9rem] xl:text-[3.7rem] 2xl:text-[5rem] text-white">
							Go Ahead.
							<br />
							Forget Your Passwords.
						</h1>
						<p className="mt-6 mb-8 text-lg sm:mb-12 text-white">
							Password1 - Your free, open-source password manager
							for secure and effortless password management.
							Create a profile today and take control of your
							online security with our state-of-the-art encryption
							that will ensure that your passwords are always safe
							:)
						</p>
						<div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
							<Link
								to="/signup"
								className="px-8 py-3 text-lg font-semibold rounded bg-[#505BAF] hover:bg-white duration-150"
							>
								Create User
							</Link>
							<Link
								to="/login"
								className="px-8 py-3 text-lg font-semibold border rounded text-white hover:bg-[#505BAF] duration-150"
							>
								Choose Profile
							</Link>
						</div>
					</div>
					<img
						src={HeroVault}
						alt=""
						className="h-72 sm:h-80 md:h-[25rem] lg:h-[18rem] xl:h-[24rem] 2xl:h-[25rem]"
					/>
				</div>
			</div>
		</div>
	);
};

export default NewUser;
