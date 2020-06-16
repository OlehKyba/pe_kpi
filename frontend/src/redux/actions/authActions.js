import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    VERIFY_EMAIL,
    VERIFY_EMAIL_SUCCESS,
    VERIFY_EMAIL_FAIL,
    RETRY_VERIFY_EMAIL,
    RETRY_VERIFY_EMAIL_SUCCESS,
    RETRY_VERIFY_EMAIL_FAIL,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    LOGOUT,
} from "./types";

export function login({email, password}) {
    return {
        types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
        promise: client => client.post('/auth/sing-in', {
            data: {
                email,
                password,
            }
        })
    };
}

export function registration({email, password}) {
    return {
        types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
        promise: client => client.post('/auth/sing-up', {
            data: {
                email,
                password,
            }
        })
    };
}

export function verifyEmail({ token }) {
    return {
        types: [VERIFY_EMAIL, VERIFY_EMAIL_SUCCESS, VERIFY_EMAIL_FAIL],
        promise: client => client.put('/auth/confirm-email', {
            data: {
                token,
            }
        })
    };
}

export function retryVerifyEmail({ email }) {
    return {
        types: [RETRY_VERIFY_EMAIL, RETRY_VERIFY_EMAIL_SUCCESS, RETRY_VERIFY_EMAIL_FAIL],
        promise: client => client.post('/auth/retry-confirm-email', {
            data: {
                email,
            }
        })
    };
}

export function forgotPassword({ email }) {
    return {
        types: [FORGOT_PASSWORD, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL],
        promise: client => client.put('/auth/forgot-password', {
            data: {
                email,
            }
        })
    };
}

export function resetPassword({ password, token }) {
    return {
        types: [RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL],
        promise: client => client.put('/auth/change-password', {
            data: {
                password,
                token,
            }
        })
    };
}

export function logout() {
    return {
        type: LOGOUT,
    }
}

