import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import Auth from "./pages/Auth";
import Home from "./pages/Home";


const App = props => {
    console.log(props);
    return (
        <div className="wrapper">
            <Switch>
                <Route
                    exact
                    path={["/sign-in", "/sign-up", "/sign-up/retry-verify", "/sign-up/verify/:token", "/forgot-password", "/forgot-password/verify/:token"]}
                    component={Auth}
                />
                <Route
                    path="/"
                    render={() => (props.isAuth ? <Home /> : <Redirect to="/sign-in" />)}
                />
            </Switch>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        isAuth: Object.keys(state.auth.tokens).length > 0,
    };
}

export default connect(mapStateToProps)(App);
