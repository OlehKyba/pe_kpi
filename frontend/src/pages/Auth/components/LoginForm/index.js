import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import {Form, Input, Button, Checkbox, Result, Alert, Spin} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import { login } from "../../../../redux/actions/authActions";

class LoginForm extends Component {

    state = {
        email: null,
        password: null,
        msg: null,
        isInProcess: false,
    }


    onChange = e => {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmit = e => {
        e.preventDefault();
        const user = { email: this.state.email, password: this.state.password };
        this.props.login(user);
    };

    message = errorCode => {
        switch (errorCode) {
            case 404:
                return 'Користувач з таким email не існує!'
            case 403:
                return 'Ви маєте підтвердити свою пошту!'
            case 401:
                return 'Не коректний пароль!'
            default:
                return null;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loginError, isInProcess } = this.props;
        const newState = {};
        if (loginError !== prevProps.loginError){
            newState.msg = this.message(loginError.code);
        }
        if (isInProcess !== prevProps.isInProcess){
            console.log(isInProcess);
            newState.isInProcess = isInProcess;
        }
        if (Object.keys(newState).length > 0){
            this.setState(newState);
        }
    }

    render() {
        const onSuccessLayout = (
            <Result
                className="auth"
                status="success"
                title="Успіх!"
                subTitle={`Користувач з email ${this.state.email} успішно зайшов у свій акаунт.`}
                extra={<Link to="/home"><Button type="link">На головну</Button></Link>}
            />
        );

        const loginForm = (
            <Spin spinning={this.state.isInProcess}>
                <section className="auth">
                    <div className="auth--top">
                        <h2>Увійти в акаунт</h2>
                        <p>Будь-ласка, зайдіть в акаунт.</p>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onSubmit}
                    >
                        <Form.Item
                            name="email"
                            hasFeedback
                            rules={[
                                {
                                    type: "email",
                                    required: true,
                                    message: 'Будь-ласка, введіть ваш E-mail!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="site-form-item-icon" />}
                                placeholder="E-mail"
                                name="email"
                                onChange={this.onChange}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введіть ваш пароль!',
                                },
                            ]}
                        >
                            <Input.Password
                                name="password"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                allowClear
                                placeholder="Пароль"
                                onChange={this.onChange}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Запам'ятати мене</Checkbox>
                            </Form.Item>

                            <Link className="login-form-forgot" to="/forgot-password">
                                Забули прароль
                            </Link>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.onSubmit}>
                                Увійти
                            </Button>
                            або <Link to="/sign-up">зареєструватися!</Link>
                        </Form.Item>
                    </Form>
                    {this.state.msg ? <Alert message={this.state.msg} type="error"/> : null}
                </section>
            </Spin>

        );

        return this.props.isAuth ? onSuccessLayout : loginForm;
    }
}

const mapStateToProps = state => {
    return {
        isAuth: Object.keys(state.auth.tokens).length > 0,
        isInProcess: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
    }
};
export default connect(mapStateToProps, { login })(withRouter(LoginForm));
