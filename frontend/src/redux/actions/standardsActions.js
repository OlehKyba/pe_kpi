import {
    CREATE_STANDARD,
    CREATE_STANDARD_SUCCESS,
    CREATE_STANDARD_FAIL,
    READ_STANDARDS,
    READ_STANDARDS_SUCCESS,
    READ_STANDARDS_FAIL,
    UPDATE_STANDARD,
    UPDATE_STANDARD_SUCCESS,
    UPDATE_STANDARD_FAIL,
    DELETE_STANDARD,
    DELETE_STANDARD_SUCCESS,
    DELETE_STANDARD_FAIL,
    CREATE_STANDARD_TYPE,
    SELECT_MOMENT, REMOVE_STANDARD,
} from './types';

import { colors } from "../../colors";

export function readStandards({ month }) {
    return {
        types: [READ_STANDARDS, READ_STANDARDS_SUCCESS, READ_STANDARDS_FAIL],
        promise: client => client.get('/standards/', {
            params: {
                month
            },
        })
    };
}

export function createStandard({ fakeId, type, date, value }) {
    return {
        types: [CREATE_STANDARD, CREATE_STANDARD_SUCCESS, CREATE_STANDARD_FAIL],
        promise: client => client.post('/standards', {
            data: {
                type,
                value,
                date,
            }
        }),
        standard: {fakeId, type, date, value},
    };
}

export function updateStandard({id, type, date, value}) {
    return {
        types: [UPDATE_STANDARD, UPDATE_STANDARD_SUCCESS, UPDATE_STANDARD_FAIL],
        promise: client => client.put(`/standards/${id}`, {
            data: {
                type,
                date,
                value,
            },
        }),
        standard: {id, type, date, value},
    };
}

export function deleteStandard({ id, date }) {
    return {
        types: [DELETE_STANDARD, DELETE_STANDARD_SUCCESS, DELETE_STANDARD_FAIL],
        promise: client => client.del(`/standards/${id}`),
        standard: { id, date },
    };
}

export function addStandardType({ name }) {
    return {
        type: CREATE_STANDARD_TYPE,
        result: {
            name,
            color: colors.pop(),
        }
    }
}

export function selectMoment({ moment }) {
    return {
        type: SELECT_MOMENT,
        result: { moment },
    };
}
