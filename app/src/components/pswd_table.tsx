import React from "react";
import { useEffect } from "react";
import {
	decrypt,
	bcrypt_hash,
	getPassword,
	encrypt,
	postNewPassword,
	deletePassword,
} from "../core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import { EditPasswordForm } from "./";

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

type Keys = {
	vault: { hash: string; salt: string };
	auth: { hash: string; salt: string };
};

const PasswordTable = ({
	passwords,
	data,
}: {
	passwords: Password[];
	data: {
		user: {
			id: string;
			username: string;
			auth_key_hash: string;
		};
		keys: Keys;
	};
}) => {
	const [showEditView, setShowEditView] = useState(false);
	const [passwordId, setPasswordId] = useState<string>();

	return (
		<div>
			<EditPasswordForm
				keys={data.keys}
				owner_id={data.user.id}
				show={showEditView}
				setStateFunction={setShowEditView}
				passwordId={passwordId}
			/>
			<div className="flex flex-col ">
				<div className=" sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
						<div>
							<table className="min-w-full text-left text-sm font-light overflow-auto">
								<thead className="border-b font-medium sticky top-0 bg-white w-full ">
									<tr>
										<th scope="col" className="px-6 py-4">
											Icon
										</th>
										<th scope="col" className="px-6 py-4">
											Name
										</th>
										<th scope="col" className="px-6 py-4">
											Website
										</th>
										<th scope="col" className="px-6 py-4">
											Last Used
										</th>
										<th scope="col" className="px-6 py-4">
											Date Used
										</th>
										<th scope="col" className="px-6 py-4">
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{passwords.map((password) => {
										return (
											<tr
												key={password.id}
												onClick={async () => {
													let key = await bcrypt_hash(
														data.keys.vault.hash,
														password.salt
													);
													console.log(
														password.password,
														password.salt,
														decrypt(password.password, key.hash)
													);
												}}
												className="border-b"
											>
												<td className="whitespace-nowrap px-6 py-4 w-24">
													<img
														src={`https://www.google.com/s2/favicons?domain=${password.url}&sz=256`}
														alt="Website icon"
													/>
												</td>
												<td className="whitespace-nowrap px-6 py-4 font-medium">
													{password.name}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{password.url}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{new Date(password.last_edited).toLocaleString(
														"en-NZ"
													)}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{new Date(password.date_added).toLocaleString(
														"en-NZ"
													)}
												</td>
												<td className="whitespace-nowrap flex gap-2 px-6 py-4">
													<button
														onClick={() => {
															setShowEditView(true);
															setPasswordId(password.id);
														}}
														className="text-bold px-4 py-2.5 rounded bg-green-600 text-white"
													>
														<FontAwesomeIcon
															icon={"fa-solid fa-eye" as IconProp}
														/>
													</button>
													<button
														onClick={() => {
															deletePassword(
																data.user.id,
																password.id,
																data.keys.auth.hash
															);
														}}
														className="text-bold px-4 py-2.5 rounded bg-red-500 text-white"
													>
														<FontAwesomeIcon
															icon={"fa-solid fa-trash" as IconProp}
														/>
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PasswordTable;
