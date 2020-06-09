
function setAuthState(state) {
    try {
        localStorage.setItem('state.auth.tokens', JSON.stringify((state.auth || {}).tokens));
    } catch (err) {
        return undefined;
    }
}

function getAuthState() {
    try {
        const tokens = JSON.parse(localStorage.getItem('state.auth.tokens')) || {};
        return { tokens };
    } catch (err) {
        return { tokens: {}};
    }
}

export { setAuthState, getAuthState };
