import React, { Component }from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import {Button, Result, Spin, Form, Input, } from "antd";
import { LockOutlined } from '@ant-design/icons';

import { resetPassword } from "../../../../redux/actions/authActions";


class ChangePasswordPage extends Component {

    state = {
        isInProcess: false,
        isComplete: false,
        msg: null,
    }

    onErrorMessage = errorCode => {
        switch (errorCode) {
            case 404:
                return {
                    status: 404,
                    title: 'Помилка',
                    subtitle: 'Користувач з таким email не існує!',
                    extra: () => null,

                };
            case 401:
                return {
                    status: "error",
                    title: 'Упс!',
                    subtitle: 'Щось пішло не так. Можливо, час на підтвердження пошти вийшов. Спробуйте виконати запит на зміну пароля ще раз.',
                    extra: () => (
                        <Link to='/forgot-password'>
                            <Button danger>
                                Надіслати лист
                            </Button>
                        </Link>),
                };
            default:
                return {
                    status: "error",
                    title: 'Помилка',
                    subtitle: 'Щось пішло не так.',
                    extra: () => null,

                };
        }
    };

    onSuccessMessage = () => ({
        status: "success",
        title: "Успіх",
        subtitle: "Вітаємо! Ви змінили пароль.",
        extra: () => (
            <Link to='/sign-in'>
                <Button danger>
                    До Входу
                </Button>
            </Link>),
    });

    onSubmit = ({ password }) => {
        const { token } = this.props.match.params
        this.props.resetPassword({ password, token });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { resetPasswordError, isInProcess, isComplete } = this.props;
        const newState = {};
        if (resetPasswordError !== prevProps.resetPasswordError){
            newState.msg = this.onErrorMessage(resetPasswordError.code);
        }
        if (isInProcess !== prevProps.isInProcess){
            newState.isInProcess = isInProcess;
        }

        if (isComplete !== prevProps.isComplete){
            newState.isComplete = isComplete;
        }

        if (Object.keys(newState).length > 0){
            this.setState(newState);
        }
    }

    render() {
        const resetPasswordForm = (
            <Spin spinning={this.state.isInProcess}>
                <section className="auth">
                    <div className="auth--top">
                        <h2>Зміна пароля</h2>
                        <p>Введіть новий пароль.</p>
                    </div>
                    <Form
                        name="change_password"
                        onFinish={this.onSubmit}
                    >
                        <Form.Item
                            name="password"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Будь-ласка, введіть новий пароль!',
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
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Відправити лист
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </Spin>
        );

        const result = this.state.msg ? this.state.msg : this.onSuccessMessage();

        const feedback = (
            <Result
                className="auth"
                status={result.status}
                title={result.title}
                subTitle={result.subtitle}
                extra={result.extra()}
            />
        );
        return this.state.isComplete ? feedback : resetPasswordForm;
    }
}


const mapStateToProps = state => {
    return {
        isInProcess: state.auth.isResetPasswordInProcess,
        isComplete: state.auth.isResetPasswordReqComplete,
        resetPasswordError: state.auth.resetPasswordError,
    }
};

export default connect(mapStateToProps, { resetPassword })(withRouter(ChangePasswordPage));
