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
        default:
            return {
                ...state,
            };
    }
};
