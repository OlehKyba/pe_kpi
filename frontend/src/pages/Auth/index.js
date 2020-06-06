import React from "react";
import { Route } from "react-router-dom";
import { Row, Col} from 'antd';

import './index.css';

import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegisterForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const Auth = () => (
    <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
        <Col>
            <Route exact path="/sign-in" component={LoginForm} />
            <Route exact path="/sign-up" component={RegistrationForm} />
            <Route exact path="/forgot-password" component={ForgotPasswordForm} />
        </Col>
    </Row>
);

export default Auth;
