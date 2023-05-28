import { passwordStrength } from "check-password-strength"
import { ValidationError } from "./types"

function runValidation(username: string, password: string): ValidationError {
    if (!isNaN(parseInt(username[0]))) {
        return {
            success: false,
            error: {
                title: "Invalid Username",
                body: "Username can not begin with a number",
            },
        }
    }
    if (
        !/^(?=.{3,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
            username
        )
    ) {
        return {
            success: false,
            error: {
                title: "Invalid Username",
                body: "Usernames can be 3-32 characters long and allowed characters are: a-z, A-Z, 0-9, '.' and '_' lastly no _ or . at the beginning or end of the username",
            },
        }
    }
    if (password.length < 12) {
        return {
            success: false,
            error: {
                title: "Password To Short",
                body: "i-- mean its got a good personality but it should be 12 characters or more",
            },
        }
    }
    if (passwordStrength(password).value !== "Strong") {
        return {
            success: false,
            error: {
                title: "Password Weak",
                body: "Password was too weak L skill issue make better password it should include symbols uppercase numbers and lowercase",
            },
        }
    }
    return { success: true, error: null }
}

const isUrl = (url: string) => {
    try {
        return Boolean(new URL(url))
    } catch (e) {
        return false
    }
}
function runValidationPassword(password: string, url: string): ValidationError {
    if (!isUrl(url)) {
        return {
            success: false,
            error: {
                title: "Invalid URL",
                body: "The URL you provided for the website is not a valid url",
            },
        }
    }
    if (password.length < 12) {
        return {
            success: false,
            error: {
                title: "Password To Short",
                body: "i-- mean its got a good personality but it should be 12 characters or more",
            },
        }
    }
    if (passwordStrength(password).value !== "Strong") {
        return {
            success: false,
            error: {
                title: "Password Weak",
                body: "Password was too weak L skill issue make better password it should include symbols uppercase numbers and lowercase",
            },
        }
    }
    return { success: true, error: null }
}
export { runValidation, runValidationPassword }
