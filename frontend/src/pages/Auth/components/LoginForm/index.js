import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import {Form, Input, Button, Checkbox, Result, Alert, Spin} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import { login } from "../../../../redux/actions/authActions";

class LoginForm extends Component {

    state = {
        msg: null,
        isInProcess: false,
    }

    onSubmit = data => {
        const user = { email: data.email, password: data.password };
        this.props.login(user);
    };

    message = errorCode => {
        switch (errorCode) {
            case 404:
                return 'Користувач з таким email не існує!';
            case 403:
                return (
                    <div>
                        <span>
                            Ви маєте підтвердити свою пошту!
                        </span>
                        <Link to='/sign-up/retry-verify'>
                            <Button danger type="link" size="small">Натисніть сюди</Button>
                        </Link>
                    </div>
                );
            case 401:
                return 'Не коректний пароль!';
            default:
                return null;
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loginError, isInProcess } = this.props;
        const newState = {};
        if (loginError !== prevProps.loginError){
            newState.msg = this.message(loginError.code);
        }
        if (isInProcess !== prevProps.isInProcess){
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
                subTitle="Ви успішно зайшли в свій акаунт!"
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
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                allowClear
                                placeholder="Пароль"
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
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Увійти
                            </Button>
                            або <Link to="/sign-up">зареєструватися!</Link>
                        </Form.Item>
                    </Form>
                    {this.state.msg ? <Alert message={this.state.msg} type="error" showIcon/> : null}
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
export default connect(mapStateToProps, { login })(LoginForm);
