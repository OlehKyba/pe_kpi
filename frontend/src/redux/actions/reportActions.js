import {
    REPORT_REQUEST,
    REPORT_REQUEST_SUCCESS,
    REPORT_REQUEST_FAIL
} from './types';

export function reportRequest({ month }) {
    return {
        types: [REPORT_REQUEST, REPORT_REQUEST_SUCCESS, REPORT_REQUEST_FAIL],
        promise: client => client.get(`/reports/${month + 1}`),
        month,
    };
}
