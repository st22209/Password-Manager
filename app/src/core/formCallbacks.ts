import { bcrypt_hash, postNewUser } from "../core";
import { Store } from "tauri-plugin-store-api";

async function signupSubmitCallback(
	event: React.FormEvent<HTMLFormElement>,
	username: string,
	password: string
) {
	event.preventDefault();

	let vaultKey = await bcrypt_hash(`${password}${username}`);
	let authKey = await bcrypt_hash(`${vaultKey.hash}${username}`);

	let store = new Store("salts.dat");
	
	await store.set(`${username}-vault-salt`, vaultKey.salt);
	await store.set(`${username}-auth-salt`, authKey.salt);
	
	await store.save()

	await postNewUser(username, authKey.hash)
}

export {
    signupSubmitCallback
}