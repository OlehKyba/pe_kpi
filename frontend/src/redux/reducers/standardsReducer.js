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

/**
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateStandardsByMonth = state => {
    const { selectedDate } = state;
    const numberOfDays = selectedDate.daysInMonth();
    const year = selectedDate.year();
    const month = selectedDate.month();
    const heartbeats = Array.from({length: numberOfDays}, (item, index) => {
        return {
            id: uuidv4(),
            type: 'Пульс',
            date: moment({year, month, date: index + 1}),
            value: getRandomInt(60, 100),
        };
    });

    const randomDates = Array.from({length: 5}, () => getRandomInt(1, numberOfDays - 1))
                             .sort()
                             .map(date => moment({year, month, date}));

    const selfAwareness = randomDates.map(date => {
        return {
            date,
            id: uuidv4(),
            type: 'Самовідчуття',
            value: getRandomInt(1, 5),
        };
    });

    const pullUps = randomDates.map(date => {
        return {
            date,
            id: uuidv4(),
            type: 'Підтягування',
            value: getRandomInt(1, 10),
        };
    });

    const data = [...heartbeats, ...selfAwareness, ...pullUps].sort((a, b) => a.date.diff(b.date))
                                                              .map(item => ({...item, date: item.date.toISOString()}));
    return { data };
};
 */

const getInitState = (date=moment(), workingMonths=[8, 9, 10, 11, 0, 1, 2, 3, 4, 5]) => {
    const currentDate = date;
    let selectedDate = date;

    const currentYear = date.year();
    const currentMonth = date.month();

    const terms = currentMonth > 7 ? [currentYear, currentYear + 1] : [currentYear - 1, currentYear];

    if([6, 7].includes(currentMonth)){
        selectedDate = moment({year: terms[0], month: 8, date: 1});
    }

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
    const readTemporaryStorage = [];
    const deleteTemporaryStorage = [];
    const errors = {};

    return {
        currentDate,
        selectedDate,
        data,
        terms,
        standardTypes,
        createTemporaryStorage,
        updateTemporaryStorage,
        readTemporaryStorage,
        deleteTemporaryStorage,
        errors,
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
        case READ_STANDARDS:
        {
            const month = action.params.month;
            const readTemporaryStorage = [...state.readTemporaryStorage, month];
            return {
                ...state,
                readTemporaryStorage,
                errors: {},
            };
        }
        case READ_STANDARDS_SUCCESS:
        {
            const { data } = action.result;
            const inSystemStandardTypes = state.standardTypes.map(item => item.name);
            const newStandardTypes = data.reduce((unique, item) =>
                    unique.includes(item.type) || inSystemStandardTypes.includes(item.type)
                        ? unique
                        : [...unique, item.type],
                [])
                .map(name => ({name, color: colors.pop(), chart: state.defaultChart}));
            const standardTypes = [...state.standardTypes, ...newStandardTypes];
            data.forEach(item => (item.date = moment(item.date)));
            const { month } = action.params;
            const monthName = moment.months(month);
            const readTemporaryStorage = [...state.readTemporaryStorage];
            const index = readTemporaryStorage.findIndex(item => item === month);
            if (index !== -1){
                readTemporaryStorage.splice(index, 1);
            }
            return {
                ...state,
                data: {...state.data, [monthName]: data},
                standardTypes,
                readTemporaryStorage,
            };
        }
        case READ_STANDARDS_FAIL:
        {
            const { month } = action.params;
            const readTemporaryStorage = [...state.readTemporaryStorage];
            const index = readTemporaryStorage.findIndex(item => item === month);
            if (index !== -1){
                readTemporaryStorage.splice(index, 1);
            }
            return {
                ...state,
                errors: {read: action.error},
            };
        }
        case CREATE_STANDARD:
            {
                const standard = action.standard;
                return {
                    ...state,
                    createTemporaryStorage: [standard.fakeId, ...state.createTemporaryStorage],
                    errors: {},
                };
            }
        case CREATE_STANDARD_SUCCESS:
        {
            const { standard, result } = action.standard;
            const createTemporaryStorage = [...state.createTemporaryStorage];
            const index = createTemporaryStorage.findIndex(item => item === standard.fakeId);
            if (index !== -1){
                createTemporaryStorage.splice(index, 1);
            }
            delete standard.fakeId;
            standard.id = result.id;
            const month = moment.months(standard.date.month());
            const newMonthDate = [...state.data[month], standard].sort((a, b) => a.date.diff(b.date));
            return {
                ...state,
                data: {...state.data, [month]: newMonthDate},
                createTemporaryStorage,
            };
        }
        case CREATE_STANDARD_FAIL:
            {
                const createTemporaryStorage = [...state.createTemporaryStorage];
                const index = createTemporaryStorage.findIndex(item => item === action.standard.fakeId);
                if (index !== -1){
                    createTemporaryStorage.splice(index, 1);
                }
                return {
                   ...state,
                    errors: {create: action.error},
                    createTemporaryStorage,
                };
            }
        case UPDATE_STANDARD:
        {
            const updatedStandard = action.standard;
            const updateTemporaryStorage = [...state.updateTemporaryStorage, updatedStandard.id];
            return {
                ...state,
                updateTemporaryStorage,
                errors: {},
            };
        }
        case UPDATE_STANDARD_SUCCESS:
        {
            const updatedStandard = action.standard;
            const month = moment.months(updatedStandard.date.month());
            const updateTemporaryStorage = [...state.updateTemporaryStorage];
            const index = state.data[month].findIndex(item => item.id === updatedStandard.id);
            const monthArray = [...state.data[month]];
            if (index !== -1){
                monthArray.splice(index, 1, updatedStandard);
                const delIndex = updateTemporaryStorage.findIndex(item => item === updatedStandard.id);
                updateTemporaryStorage.splice(delIndex, 1);
            }
            return {
                ...state,
                updateTemporaryStorage,
                data: {...state.data, [month]: monthArray},
                errors: {},
            };
        }
        case UPDATE_STANDARD_FAIL:
        {
            const { id } = action.standard;
            const updateTemporaryStorage = [...state.updateTemporaryStorage];
            const index = updateTemporaryStorage.findIndex(item => item === id);
            if (index !== -1){
                updateTemporaryStorage.splice(index, 1);
            }
            return {
                ...state,
                errors: {update: {id: action.standard.id, error: action.error}},
                updateTemporaryStorage,
            };
        }
        case DELETE_STANDARD:
        {
            const deleteTemporaryStorage = [...state.deleteTemporaryStorage, action.standard.id];
            return {
                ...state,
                deleteTemporaryStorage,
                errors: {},
            };
        }
        case DELETE_STANDARD_SUCCESS:
        {
            const { id, date } = action.standard;
            const month = moment.months(date.month());
            const monthArray = [...state.data[month]];
            const deleteTemporaryStorage = [...state.deleteTemporaryStorage];
            const index = monthArray.findIndex(item => item.id === id);
            if (index !== -1){
                monthArray.splice(index, 1);
                const delIndex = deleteTemporaryStorage.findIndex(item => item === id);
                deleteTemporaryStorage.splice(delIndex, 1);
            }
            return {
                ...state,
                data: {...state.data, [month]: monthArray},
                deleteTemporaryStorage,
                errors: {},
            };
        }
        case DELETE_STANDARD_FAIL:
        {
            const { id } = action.standard;
            const deleteTemporaryStorage = [...state.deleteTemporaryStorage];
            const index = deleteTemporaryStorage.findIndex(item => item === id);
            if (index !== -1){
                deleteTemporaryStorage.splice(index, 1);
            }
            return {
                ...state,
                errors: {delete: {id: action.standard.id, error: action.error}},
                deleteTemporaryStorage,
            };
        }
        default:
            return {...state};
    }
};
