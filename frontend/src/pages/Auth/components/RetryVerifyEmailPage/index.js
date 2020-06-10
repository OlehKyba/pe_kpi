import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import { Form, Input, Button, Result, Spin } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { retryVerifyEmail } from "../../../../redux/actions/authActions";



class RetryVerifyEmailPage extends Component{

    onErrorMessage = errorCode => {
        switch (errorCode) {
            case 404:
                return {
                    status: 404,
                    title: 'Помилка',
                    subtitle: 'Користувач з таким email не існує!',
                    extra: () => null,
                };
            case 403:
                return {
                    status: 403,
                    title: 'Перевірте вашу пошту',
                    subtitle: 'Перевірте вашу пошту, вам мав прийти лист. Якщо його ще не має, почекайте приблизно 15 хвилин та спробуйте ще раз.',
                    extra: () => null,
                };
            case 409:
                return {
                    status: "success",
                    title: "Успіх",
                    subtitle: "Вітаємо! Ви підтвердили вашу електронну пошту.",
                    extra: () => (<Link to="/sign-in"><Button>Зайти в акаунт</Button></Link>),
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
        subtitle: "Лист має надійти. Перевірте вашу пошту, якщо лист не надійде спробуйте ще раз чкрез 15 хвилин.",
        extra: () => (<Link to="/sign-in"><Button>До логіну</Button></Link>),
    });

    state = {
        isInProcess: false,
        isSuccessTry: false,
        msg: null,
    };

    onSubmit = data => {
        this.props.retryVerifyEmail(data);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { retryVerifyEmailError, isInProcess, isSuccessTry } = this.props;
        const newState = {};
        if (retryVerifyEmailError !== prevProps.retryVerifyEmailError){
            newState.msg = this.onErrorMessage(retryVerifyEmailError.code);
        }
        if (isInProcess !== prevProps.isInProcess){
            newState.isInProcess = isInProcess;
        }

        if (isSuccessTry !== prevProps.isSuccessTry){
            newState.isSuccessTry = isSuccessTry;
        }

        if (Object.keys(newState).length > 0){
            this.setState(newState);
        }
    }


    render() {
        const retryVerifyEmailForm = (
            <Spin spinning={this.state.isInProcess}>
                <section className="auth">
                    <div className="auth--top">
                        <h2>Не прийшло повідомлення?</h2>
                        <p>Введіть ваш email, ми відправимо лист для підтвердженння електронної пошти.</p>
                    </div>
                    <Form
                        name="retry_verify_email"
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
        return this.state.isSuccessTry ? feedback : retryVerifyEmailForm;
    }
}

const mapStateToProps = state => ({
    isInProcess: state.auth.isRetryingVerifyEmail,
    isSuccessTry: state.auth.isAcceptedTry,
    retryVerifyEmailError: state.auth.retryVerifyEmailError,
});

export default connect(mapStateToProps, { retryVerifyEmail })(RetryVerifyEmailPage);
