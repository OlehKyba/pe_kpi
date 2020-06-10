import { SET_TOKENS, LOGOUT } from "../actions/types";


const needRefreshMessage = 'Token has expired';


export function requestMiddleware(client, setTokensType=SET_TOKENS, logoutType=LOGOUT) {
    return ({ dispatch, getState }) => next => (action) => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        const { promise, types, ...rest } = action;
        if (!promise) {
            return next(action);
        }

        const [REQUEST, SUCCESS, FAILURE] = types;
        next({ ...rest, type: REQUEST });

        const {accessToken, refreshToken} = getState().auth.tokens;
        const actionPromise = promise(client)(accessToken);

        actionPromise.then(
            result => next({...rest, result, type: SUCCESS}),
            error => {
                if(error.code === 401 && error.body.msg === needRefreshMessage && accessToken){
                    return client.post('/auth/refresh', { data: { refreshToken } })()
                        .then(result => next({...rest, result, type: setTokensType}))
                        .then(result => {
                            if (!result.error){
                                return promise(client)(getState().auth.tokens.accessToken)
                                    .then(result => next({...rest, result, type: SUCCESS}))
                                    .catch(error => next({...rest, error, type: FAILURE}));
                            }
                            return Promise.resolve(result);
                        })
                        .catch(error => next({...rest, error, type: logoutType}));
                }
                return next({...rest, error, type: FAILURE});
            }
        ).catch((error)=> {
            console.error('MIDDLEWARE ERROR:', error);
            next({...rest, error, type: FAILURE});
        });
        return actionPromise;
    };
}
