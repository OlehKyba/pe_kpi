import {
    SET_TOKENS,
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    VERIFY_EMAIL,
    VERIFY_EMAIL_SUCCESS,
    VERIFY_EMAIL_FAIL,
    LOGOUT,
    RETRY_VERIFY_EMAIL,
    RETRY_VERIFY_EMAIL_SUCCESS,
    RETRY_VERIFY_EMAIL_FAIL,
} from '../actions/types';

const initialState = {
    isAuth: false,
    isLoggingIn: false,
    isRegisterIn: false,
    isRegisterComplete: false,
    isisVerifyingEmail: false,
    isVerifiedEmail: false,
}

export const authReducer = (state = initialState, action) =>{
    switch (action.type) {
        case SET_TOKENS:
            return {
                ...state,
                tokens: action.result,
            };
        case LOGOUT:
            return {
                ...state,
                tokens: {},
            }
        case REGISTER:
            return {
                ...state,
                isRegisterIn: true,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                isRegisterIn: false,
                isRegisterComplete: true,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isRegisterIn: false,
                isRegisterComplete: false,
                registerError: action.error,
            };
        case LOGIN:
            return {
                ...state,
                isLoggingIn: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                isLoggingIn: false,
                tokens: action.result,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggingIn: false,
                tokens: {},
                loginError: action.error
            };
        case VERIFY_EMAIL:
            return {
                ...state,
                isVerifyingEmail: true,
            };
        case VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                isVerifyingEmail: false,
                isVerifiedEmail: true,
            };
        case VERIFY_EMAIL_FAIL:
            return {
                ...state,
                isisVerifyingEmail: false,
                isVerifiedEmail: true,
                verifyEmailError: action.error,
            };

        case RETRY_VERIFY_EMAIL:
            return {
                ...state,
                isRetryingVerifyEmail: true,
            };
        case RETRY_VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                isRetryingVerifyEmail: false,
                isAcceptedTry: true,
            }
        case RETRY_VERIFY_EMAIL_FAIL:
            return {
                ...state,
                isRetryingVerifyEmail: false,
                isAcceptedTry: false,
                retryVerifyEmailError: action.error,
            }
        case 'USER':
            return {
                ...state,
            };
        case 'USER_SUCCESS':
            return {
                ...state,
                userData: action.data,
            }
        case 'USER_FAIL':
            return {
                ...state,
                userError: action.error,
            };
        default:
            return state;
    }
}
