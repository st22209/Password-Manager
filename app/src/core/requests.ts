const BASE_URL = "http://127.0.0.1:8443/api"

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
            type: "api"
        }
    }

    let response_json = await response.json();
    if (response_json["success"] === false) {
        if (response.status === 422) {
            return {
                success: false,
                type: "invalid"
            }
        } else if (response.status === 407) {
            return {
                success: false,
                type: "conflict"
            }
        }
    }
    return response_json

}

export { postNewUser }