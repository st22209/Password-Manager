import { bcrypt_hash, postNewUser } from "../core";
import { Store } from "tauri-plugin-store-api";

type User = {
	success: true;
	detail: string;
	user: {
		id: string;
		username: string;
		auth_key_hash: string;
	};
};

type NewUserError = {
	success: false;
	type: string;
	error: {
		title: string,
		body: string
	}
};

async function signupSubmitCallback(
	username: string,
	password: string,
): Promise<User | NewUserError> {
	let vaultKey = await bcrypt_hash(`${password}${username}`);
	let authKey = await bcrypt_hash(`${vaultKey.hash}${username}`);

	let store = new Store("salts.dat");

	await store.set(`${username}-vault-salt`, vaultKey.salt);
	await store.set(`${username}-auth-salt`, authKey.salt);

	await store.save()

	return await postNewUser(username, authKey.hash)
}

export {
	signupSubmitCallback
}