import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from "./pages/Auth";
import Home from "./pages/Home";


const App = props => {
    return (
        <div className="wrapper">
            <Switch>
                <Route
                    exact
                    path={["/sign-in", "/sign-up", "/sign-up/verify", "/forgot-password"]}
                    component={Auth}
                />
                <Route
                    path="/"
                    component={Home}
                    //render={() => (isAuth ? <Home /> : <Redirect to="/sign-in" />)}
                />
            </Switch>
        </div>
    )
}


export default App;
