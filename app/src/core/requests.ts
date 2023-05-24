const BASE_URL = "http://127.0.0.1:8443/api"
const STATUS_CODES = {
    INVALID: 422,
    CONFLICT: 409,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401
}

type User = {
    success: true;
    detail: string;
    user: {
        id: string;
        username: string;
        auth_key_hash: string;
    };
};

type APIError = {
    success: false;
    type: string;
    error: {
        title: string,
        body: string
    }
};

type Password = {
    id: string
    name: string
    username: string
    encrypted_password: string
    salt: string
    url: string
    note: string
    date_added: string
    last_edited: string
    owner_id: string
}

async function postNewUser(username: string, authKeyHash: string) {
    const API_URL = `${BASE_URL}/users`
    let response_data = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": username,
            "auth_key": authKeyHash
        })
    }
    let response;
    try {
        response = await fetch(API_URL, response_data);
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port"
            }
        }
    }

    let response_json = await response.json();
    if (response_json["detail"]["success"] === false) {
        if (response.status === STATUS_CODES.INVALID) {
            return {
                success: false,
                type: "invalid",
                error: {
                    title: "Username Invalid",
                    body: "The username failed the checks! Please ensure the username is valid"
                }
            }
        } else if (response.status === STATUS_CODES.CONFLICT) {
            return {
                success: false,
                type: "conflict",
                error: {
                    title: "Username Conflict",
                    body: "There is already someone with this username, please use another"
                }
            }
        }
    }
    return response_json

}

async function authGetUser(username: string, authKey: string): Promise<User | APIError> {
    const API_URL = `${BASE_URL}/users?user_id=${username}&auth_key=${authKey}&username=true`
    let response_data = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }
    let response;
    try {
        response = await fetch(API_URL, response_data);
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port"
            }
        }
    }
    let response_json = await response.json();
    if (response_json.success === undefined && response_json["detail"]["success"] === false) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username Not Found",
                    body: "aint no account exist with this username. You sure you spelt it right?"
                }
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly"
                }
            }
        }
    }
    return response_json
}

async function getPassword(owner_id: string, authKey: string): Promise<Password[] | APIError>;
async function getPassword(owner_id: string, authKey: string, id: string): Promise<Password | APIError>;

async function getPassword(owner_id: string, authKey: string, id?: string): Promise<unknown> {
    let API_URL
    (id === null || id === undefined)
        ? API_URL = `${BASE_URL}/passwords?owner_id=${owner_id}&auth_key=${authKey}`
        : API_URL = `${BASE_URL}/passwords?owner_id=${owner_id}&auth_key=${authKey}&password_id=${id}`

    let response_data = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }
    let response;
    try {
        response = await fetch(API_URL, response_data);
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port"
            }
        }
    }
    let response_json = await response.json();
    if (response_json.success === undefined && response_json["detail"]["success"] === false) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username or Password Not Found",
                    body: "Either the user account you are using is wrong or the password does not exist"
                }
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly"
                }
            }
        }
    }
    return response_json
}

export { postNewUser, authGetUser, getPassword }