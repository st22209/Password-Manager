import { PasswordForm, PasswordTable } from "../components";
import React from "react";
import { useEffect, useState } from "react";
import { decrypt, bcrypt_hash, getPassword, encrypt } from "../core";

type Keys = {
	vault: { hash: string; salt: string };
	auth: { hash: string; salt: string };
};

type Password = {
	id: string;
	name: string;
	username: string;
	password: string;
	salt: string;
	url: string;
	note: string;
	date_added: string;
	last_edited: string;
	owner_id: string;
};

type SinglePassword = {
	success: boolean;
	password: Password;
};
type PasswordArray = {
	success: boolean;
	passwords: Password[];
};

const AllPasswords = ({
	user,
	keys,
}: {
	user: {
		id: string;
		username: string;
		auth_key_hash: string;
	};
	keys: Keys;
}) => {
	const [passwords, setPasswords] = useState<Password[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			let data = await getPassword(user.id, keys.auth.hash);
			if (data.success) {
				setPasswords(data.passwords);
			}
		}
		fetchData()
		const loop = setInterval(fetchData, 10e3);
		return () => clearInterval(loop);
	}, []);

	return (
		<div>
			<div className="p-10 flex-col flex">
				<div>
					<h1 className="font-bold text-[2rem] float-left mb-5">
						All Passwords
					</h1>
					<button className="text-bold px-7 py-2.5 float-right text-lg font-semibold rounded bg-[#505BAF] text-white">
						New Password
					</button>
				</div>
				<div className="mt-5">
					<PasswordTable passwords={passwords} vault_key={keys.vault.hash}/>
				</div>
			</div>
		</div>
	);
};

export default AllPasswords;