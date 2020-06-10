import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";

import rootReducer from "./reducers";
import { requestMiddleware } from "./middlewares/requestMiddleware"
import { getAuthState, setAuthState } from '../storage/localStorage';
import { ApiClient } from "../api/clientApi";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const client = new ApiClient();
const middleware = [thunk, requestMiddleware(client)];
const store = createStore(
    rootReducer,
    { auth: {...getAuthState()} },
    composeEnhancers(applyMiddleware(...middleware))
);

store.subscribe(() => {
    setAuthState(store.getState())
});

export default store;
