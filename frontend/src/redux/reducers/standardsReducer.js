import moment from "../../moment";
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
    SELECT_MOMENT,
} from '../actions/types';

import { colors } from "../../colors";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
    });
}


const getInitState = (date=moment(), workingMonths=[8, 9, 10, 11, 0, 1, 2, 3, 4, 5]) => {
    const currentDate = date;
    const selectedDate = date;

    const day = date.date();
    const currentYear = date.year();
    const currentMonth = date.month();
    date = moment({year: currentYear, month: currentMonth, date: day});
    const terms = currentMonth > 7 ? [currentYear, currentYear + 1] : [currentYear - 1, currentYear];
    const example = {
        id: '45b1afd1-50bd-411e-9c12-a12af4c05bea',
        type: 'Пульс',
        value: 80,
        date,
    };

    const standardTypes = [
        {
            name: 'Пульс',
            chart: 'bar',
            color: colors.pop(),
        },
        {
            name: 'Самовідчуття',
            chart: 'bar',
            color: colors.pop(),
        }
    ];

    const data = Object.fromEntries(
        Array.from(workingMonths, item => [moment.months(item), []])
    );

    const createTemporaryStorage = [];
    const updateTemporaryStorage = [];

    data[moment.months(currentMonth)].push(example);
    return {
        currentDate,
        selectedDate,
        data,
        terms,
        standardTypes,
        createTemporaryStorage,
        updateTemporaryStorage,
        defaultChart: 'line',
    };
};

export const standardsReducer = (state=getInitState(), action) => {
    switch (action.type) {
        case SELECT_MOMENT:
            return {
                ...state,
                selectedDate: action.result.moment,
            };
        case CREATE_STANDARD_TYPE:
            return {
                ...state,
                standardTypes: [...state.standardTypes, {...action.result, chart: state.defaultChart}],
            };

        case CREATE_STANDARD:
            {
                const standard = action.standard;
                const month = moment.months(standard.date.month());
                const newMonthDate = [...state.data[month], standard].sort((a, b) => a.date.diff(b.date));
                return {
                    ...state,
                    data: {...state.data, [month]: newMonthDate},
                    createTemporaryStorage: [standard.fakeId, ...state.createTemporaryStorage],
                };
            }
        case CREATE_STANDARD_SUCCESS:
        case CREATE_STANDARD_FAIL:
            {
                const standard = action.standard;
                const month = moment.months(standard.date.month());
                const id = action.result || uuidv4();

                const createTemporaryStorage = [...state.createTemporaryStorage];
                const i = createTemporaryStorage.indexOf(standard.fakeId);
                if (i > -1) {
                    createTemporaryStorage.splice(i, 1);
                }

                const index = state.data[month].findIndex(item => item === standard);
                if (index !== -1){
                    const refreshStandard = Object.assign({ id }, standard);
                    delete refreshStandard.fakeId;
                    const monthArray = [...state.data[month]];
                    monthArray.splice(index, 1, refreshStandard);
                    return {
                        ...state,
                        createTemporaryStorage,
                        data: {...state.data, [month]: monthArray},
                    };
                }
                return {
                    ...state,
                    createTemporaryStorage,
                };
            }
        case UPDATE_STANDARD:
        {
            const updatedStandard = action.standard;
            const month = moment.months(updatedStandard.date.month());
            const updateTemporaryStorage = [...state.updateTemporaryStorage];
            const index = state.data[month].findIndex(item => item.id === updatedStandard.id);
            const monthArray = [...state.data[month]];
            if (index !== -1){
                updateTemporaryStorage.push(updatedStandard.id);
                monthArray.splice(index, 1, updatedStandard);
            }
            return {
                ...state,
                updateTemporaryStorage,
                data: {...state.data, [month]: monthArray},
            };
        }
        case UPDATE_STANDARD_SUCCESS:
        case UPDATE_STANDARD_FAIL:
        {
            return {
                ...state,
            }
        }
        case DELETE_STANDARD:
        {
            const { id, date, fakeId } = action.standard;
            const month = moment.months(date.month());
            const monthArray = [...state.data[month]];
            const findById = item => item.id === id;
            const findByFakeId = item => item.fakeId === fakeId;
            const find = id ? findById : findByFakeId;
            const index = monthArray.findIndex(find);
            if (index !== -1){
                monthArray.splice(index, 1);
            }
            return {
                ...state,
                data: {...state.data, [month]: monthArray},
            };
        }
        case DELETE_STANDARD_SUCCESS:
        case DELETE_STANDARD_FAIL:
            return {
                ...state,
            }
        default:
            return {...state};
    }
};
