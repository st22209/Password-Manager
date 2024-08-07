import {
    APIError,
    NewPassword,
    PasswordArray,
    SinglePassword,
    User,
} from "./types"

const BASE_URL = "https://password.fusionsid.com/api"
const STATUS_CODES = {
    INVALID: 422,
    CONFLICT: 409,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
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
            username: username,
            auth_key: authKeyHash,
        }),
    }
    let response
    try {
        response = await fetch(API_URL, response_data)
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port",
            },
        }
    }

    let response_json = await response.json()
    if (response_json["detail"]["success"] === false) {
        if (response.status === STATUS_CODES.INVALID) {
            return {
                success: false,
                type: "invalid",
                error: {
                    title: "Username Invalid",
                    body: "The username failed the checks! Please ensure the username is valid",
                },
            }
        } else if (response.status === STATUS_CODES.CONFLICT) {
            return {
                success: false,
                type: "conflict",
                error: {
                    title: "Username Conflict",
                    body: "There is already someone with this username, please use another",
                },
            }
        }
    }
    return response_json
}

async function postNewPassword(authKeyHash: string, passwordData: NewPassword) {
    const API_URL = `${BASE_URL}/passwords?auth_key=${authKeyHash}`
    let response_data = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-key": authKeyHash,
        },
        body: JSON.stringify(passwordData),
    }
    console.log(response_data.body)
    let response
    try {
        response = await fetch(API_URL, response_data)
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port",
            },
        }
    }
    console.log(response)

    let response_json = await response.json()
    if (response_json["detail"]["success"] === false) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username Not Found",
                    body: "aint no account exist with this username. You sure you spelt it right?",
                },
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly",
                },
            }
        }
    }
    return response_json
}

async function editPassword(
    authKeyHash: string,
    passwordID: string,
    passwordData: NewPassword
) {
    const API_URL = `${BASE_URL}/passwords?auth_key=${authKeyHash}&owner_id=${passwordData.owner_id}&password_id=${passwordID}`
    delete passwordData.owner_id

    let response_data = {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-key": authKeyHash,
        },
        body: JSON.stringify(passwordData),
    }
    let response
    try {
        response = await fetch(API_URL, response_data)
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port",
            },
        }
    }

    let response_json = await response.json()
    if (response_json["detail"]["success"] === false) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username Not Found",
                    body: "aint no account exist with this username. You sure you spelt it right?",
                },
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly",
                },
            }
        }
    }
    return response_json
}

async function authGetUser(
    username: string,
    authKey: string
): Promise<User | APIError> {
    const API_URL = `${BASE_URL}/users?user_id=${username}&auth_key=${authKey}&username=true`
    let response_data = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-key": authKey,
        },
    }
    let response
    try {
        response = await fetch(API_URL, response_data)
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port",
            },
        }
    }
    let response_json = await response.json()
    if (
        response_json.success === undefined &&
        response_json["detail"]["success"] === false
    ) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username Not Found",
                    body: "aint no account exist with this username. You sure you spelt it right?",
                },
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly",
                },
            }
        }
    }
    return response_json
}

async function getPassword(
    owner_id: string,
    authKey: string
): Promise<PasswordArray | APIError>
async function getPassword(
    owner_id: string,
    authKey: string,
    id: string
): Promise<SinglePassword | APIError>

async function getPassword(
    owner_id: string,
    authKey: string,
    id?: string
): Promise<unknown> {
    let API_URL
    id === null || id === undefined
        ? (API_URL = `${BASE_URL}/passwords?owner_id=${owner_id}`)
        : (API_URL = `${BASE_URL}/passwords?owner_id=${owner_id}&password_id=${id}`)

    let response_data = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-key": authKey,
        },
    }
    let response
    try {
        response = await fetch(API_URL, response_data)
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port",
            },
        }
    }
    let response_json = await response.json()
    if (
        response_json.success === undefined &&
        response_json["detail"]["success"] === false
    ) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username or Password Not Found",
                    body: "Either the user account you are using is wrong or the password does not exist",
                },
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly",
                },
            }
        }
    }
    return response_json
}

async function deletePassword(
    userId: string,
    passwordId: string,
    authKey: string
): Promise<{ success: true; detail: string } | APIError> {
    const API_URL = `${BASE_URL}/passwords?owner_id=${userId}&auth_key=${authKey}&password_id=${passwordId}`
    let response_data = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-key": authKey,
        },
    }
    let response
    try {
        response = await fetch(API_URL, response_data)
    } catch (err) {
        return {
            success: false,
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port",
            },
        }
    }
    let response_json = await response.json()
    if (
        response_json.success === undefined &&
        response_json["detail"]["success"] === false
    ) {
        if (response.status === STATUS_CODES.NOT_FOUND) {
            return {
                success: false,
                type: "notfound",
                error: {
                    title: "Username or Password Not Found",
                    body: "e",
                },
            }
        } else if (response.status === STATUS_CODES.UNAUTHORIZED) {
            return {
                success: false,
                type: "wrongpass",
                error: {
                    title: "Wrong Password",
                    body: "Your password is just wrong bro type it correctly",
                },
            }
        }
    }
    return response_json
}

export {
    postNewUser,
    authGetUser,
    getPassword,
    postNewPassword,
    deletePassword,
    editPassword,
}
