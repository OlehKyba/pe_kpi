import {
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAIL,
    UPDATE_USER_DATA,
    UPDATE_USER_DATA_SUCCESS,
    UPDATE_USER_DATA_FAIL,
    DELETE_USER,
    DELETE_USER_SUCCESS,
    DElETE_USER_FAIL,
} from '../actions/types';

const initState = {
        user: {},
        error: null,
        isReading: false,
        isUpdating: false,
        isDeleting: false,
        isShouldLogout: false,
};

export const userReducer = (state=initState, action) => {
    switch (action.type) {
        case GET_USER_DATA:
            return {
                ...state,
                isReading: true,
            };
        case GET_USER_DATA_SUCCESS:
            return {
                ...state,
                user: action.result,
                isReading: false,
            };
        case GET_USER_DATA_FAIL:
            return {
                ...state,
                error: action.error,
                isReading: false,
            };
        case UPDATE_USER_DATA:
            return {
                ...state,
                isUpdating: true,
            };
        case UPDATE_USER_DATA_SUCCESS:
        {
            const newUserData = action.user;
            const user = {...state.user, ...newUserData};
            return {
                ...state,
                isUpdating: false,
                user,
            };
        }
        case UPDATE_USER_DATA_FAIL:
            return {
                ...state,
                isUpdating: false,
                error: action.error
            };
        case DELETE_USER:
            return {
                ...state,
                isDeleting: true,
            };
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isDeleting: false,
                isShouldLogout: true,
                user: {},
            };
        case DElETE_USER_FAIL:
            return {
                ...state,
                isDeleting: false,
                error: action.error,
            };

        default:
            return {
                ...state,
            };
    }
};
