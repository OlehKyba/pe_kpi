import { combineReducers } from 'redux';
import { authReducer } from "./authReducer";
import { standardsReducer } from "./standardsReducer"

const rootReducer = combineReducers({
        auth: authReducer,
        standards: standardsReducer,
    }
);

export default rootReducer;
