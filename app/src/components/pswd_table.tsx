import React from "react";
import { useEffect } from "react";
import { decrypt, bcrypt_hash, getPassword, encrypt } from "../core";

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

const PasswordTable = ({ passwords, vault_key }: { passwords: Password[], vault_key:string }) => {
	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
					<div className="overflow-hidden">
						<table className="min-w-full text-left text-sm font-light">
							<thead className="border-b font-medium">
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
								</tr>
							</thead>
							<tbody>
								<tr className="border-b">
									<td className="whitespace-nowrap px-6 py-4 w-24">
										<img
											src="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a"
											alt="Website icon"
										/>
									</td>
									<td className="whitespace-nowrap px-6 py-4 font-medium">
										Stack Overflow
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										www.stackoverflow.com
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										11/06/23 10:24 PM
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										11/06/23 10:24 PM
									</td>
								</tr>
								{passwords.map((password, index) => {
									return (
										<tr
											key={index}
											onClick={async () => {
												let key = await bcrypt_hash(vault_key, password.salt)
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
													src="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a"
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
												{password.last_edited}
											</td>
											<td className="whitespace-nowrap px-6 py-4">
												{password.date_added}
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
	);
};

export default PasswordTable;
