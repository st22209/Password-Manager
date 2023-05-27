export type ValidationError =
    | {
        success: false
        error: {
            title: string
            body: string
        }
    }
    | { success: true; error: null }

export type ErrorMessage = {
    title: string
    body: string
}

export type User = {
    success: true
    detail: string
    user: {
        id: string
        username: string
        auth_key_hash: string
    }
}
export type NewUserError = {
    success: false
    type: string
    error: {
        title: string
        body: string
    }
}
export type BackupPassword = {
    name: string
    username: string
    password: string
    url: string
    note: string
    date_added: string
    last_edited: string
}
export type APIError = {
    success: false
    type: string
    error: {
        title: string
        body: string
    }
}

export type Password = {
    id: string
    name: string
    username: string
    password: string
    salt: string
    url: string
    note: string
    date_added: string
    last_edited: string
    owner_id: string
}

export type NewPassword = {
    name: string
    username: string
    password: string
    salt: string
    url: string
    note: string
    owner_id?: string
}

export type SinglePassword = {
    success: true
    password: Password
}

export type PasswordArray = {
    success: true
    passwords: Password[]
}

export type Keys = {
    vault: { hash: string; salt: string }
    auth: { hash: string; salt: string }
}
