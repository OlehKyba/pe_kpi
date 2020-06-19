import {
    REPORT_REQUEST,
    REPORT_REQUEST_SUCCESS,
    REPORT_REQUEST_FAIL
} from '../actions/types';

const initState = {
    reportsRequested: [],
    error: null,
    isSuccess: false,
};

export const reportReducer = (state=initState, action) => {
    switch (action.type) {
        case REPORT_REQUEST:
            return {
                ...state,
                reportsRequested: [...state.reportsRequested, action.month],
                isSuccess: false,
            };
        case REPORT_REQUEST_SUCCESS:
        {
            const reportsRequested = [...state.reportsRequested];
            const index = reportsRequested.findIndex(item => item === action.month);
            if (index !== -1){
                reportsRequested.splice(index, 1);
            }
            return {
                ...state,
                reportsRequested,
                isSuccess: true,
            };
        }
        case REPORT_REQUEST_FAIL:
        {
            const reportsRequested = [...state.reportsRequested];
            const index = reportsRequested.findIndex(item => item === action.month);
            if (index !== -1){
                reportsRequested.splice(index, 1);
            }
            return {
                ...state,
                reportsRequested,
                error: action.error,
                isSuccess: false,
            };
        }
        default:
            return {
                ...state,
            };
    }
}
