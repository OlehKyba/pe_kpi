import { combineReducers } from 'redux';
import { authReducer } from "./authReducer";
import { standardsReducer } from "./standardsReducer"
import { userReducer } from "./userReducer";

const rootReducer = combineReducers({
        auth: authReducer,
        standards: standardsReducer,
        users: userReducer,
    }
);

export default rootReducer;
