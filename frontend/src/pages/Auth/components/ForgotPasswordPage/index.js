import React, { Component } from "react";
import { connect } from "react-redux";

import { Form, Input, Button, Result, Spin } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { forgotPassword } from "../../../../redux/actions/authActions";
import {Link} from "react-router-dom";

class ForgotPasswordPage extends Component{

    onErrorMessage = errorCode => {
        switch (errorCode) {
            case 404:
                return {
                    status: 404,
                    title: 'Помилка',
                    subtitle: 'Користувач з таким email не існує!',
                    extra: () => null,
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
        title: "Успіх!",
        subtitle: "На вашу пошту має надійти лист з посиланням на зміну пароля.",
        extra: () => (<Link to="/sign-in"><Button>До логіну</Button></Link>),
    });


    state = {
        msg: null,
        isComplete: false,
        isInProcess: false,
    }

    onSubmit = data => {
        this.props.forgotPassword(data);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { forgotPasswordError, isInProcess, isComplete } = this.props;
        const newState = {};
        if (forgotPasswordError !== prevProps.forgotPasswordError){
            newState.msg = this.onErrorMessage(forgotPasswordError.code);
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
        const forgotPasswordForm = (
            <Spin spinning={this.state.isInProcess}>
                <section className="auth">
                    <div className="auth--top">
                        <h2>Забули пароль?</h2>
                        <p>Введіть ваш email, ми відправимо лист з посиланням на зміну пароля.</p>
                    </div>
                    <Form
                        name="forgot_password"
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
                                prefix={<MailOutlined className="site-form-item-icon"/>}
                                placeholder="E-mail"
                                hasFeedback
                                rules={[
                                    {
                                        type: "email",
                                        required: true,
                                        message: 'Будь-ласка, введіть ваш E-mail!',
                                    },
                                ]}
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
        return this.state.isComplete ? feedback : forgotPasswordForm;
    }
}

const mapStateToProps = state => ({
    isInProcess: state.auth.isForgotPasswordInProcess,
    isComplete: state.auth.isForgotPasswordReqComplete,
    forgotPasswordError: state.auth.forgotPasswordError,
});

export default connect(mapStateToProps, { forgotPassword })(ForgotPasswordPage);
