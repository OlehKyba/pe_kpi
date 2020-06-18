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
} from './types';


export function getUserData() {
    return {
        types: [GET_USER_DATA, GET_USER_DATA_SUCCESS, GET_USER_DATA_FAIL],
        promise: client => client.get('/users/'),
    };
}

export function updateUserData({name, surname, group, club}) {
    const user = { name, surname, group, club };
    return {
        types: [UPDATE_USER_DATA, UPDATE_USER_DATA_SUCCESS, UPDATE_USER_DATA_FAIL],
        promise: client => client.put('/users/', {
            data: user,
        }),
        user,
    };
}

export function deleteUser() {
    return {
        types: [DELETE_USER, DELETE_USER_SUCCESS, DElETE_USER_FAIL],
        promise: client => client.del('/users/')
    };
}
