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
            type: "api",
            error: {
                title: "Failed to make request!",
                body: "The API seems to be down! Please check its online and on the right port"
            }
        }
    }

    let response_json = await response.json();
    if (response_json["detail"]["success"] === false) {
        if (response.status === 422) {
            return {
                success: false,
                type: "invalid",
                error: {
                    title: "Username Invalid",
                    body: "The username failed the checks! Please ensure the username is valid"
                }
            }
        } else if (response.status === 409) {
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

export { postNewUser }