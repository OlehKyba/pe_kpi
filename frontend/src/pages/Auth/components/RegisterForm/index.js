import React, { Component } from "react";
import { connect } from "react-redux";

import { Form, Input, Button, Result, Alert, Spin } from 'antd';
import { MailOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

import { registration } from "../../../../redux/actions/authActions";


class RegistrationForm extends Component {
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

    message = errorCode => {
        switch (errorCode) {
            case 409:
                return 'Користувач з таким email вже існує!'
            default:
                return null;
        }
    }

    onSubmit = e => {
        const user = { email: this.state.email, password: this.state.password };
        this.props.registration(user);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { registerError, isRegisterIn } = this.props;
        if(registerError !== prevProps.registerError){
            this.setState({msg: this.message(registerError.code)})
        }
        if(isRegisterIn !== prevProps.isRegisterIn){
            this.setState({isInProcess: isRegisterIn});
        }

    }

    render() {
        const onSuccessLayout = (
            <Result
                className="auth"
                status="success"
                title="Успіх!"
                subTitle="Перевірте вашу електронну пошту, вам має прийти лист з посиланням на активацію акаунту. Якщо вам не прийшов лист, натисніть на кнопку."
                extra={
                    <Button type="primary">
                        Надіслати лист
                    </Button>
                }
            />
        );

        const registrationForm = (
            <Spin spinning={this.state.isInProcess}>
                <section className="auth">
                    <div className="auth--top">
                        <h2>Реєстрація</h2>
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
                            rules={[
                                {
                                    type: "email",
                                    required: true,
                                    message: 'Будь-ласка, введіть ваш E-mail!',
                                },
                            ]}
                            hasFeedback
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
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                allowClear
                                placeholder="Пароль"
                                name="password"
                                onChange={this.onChange}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Будь-ласка, повторіть свій пароль!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Паролі не співпадають!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<UnlockOutlined className="site-form-item-icon" />}
                                allowClear
                                placeholder="Підтвердіть пароль"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Зареєструватися
                            </Button>
                        </Form.Item>
                    </Form>
                    {this.state.msg ? <Alert message={this.state.msg} type="error"/> : null}
                </section>
            </Spin>
        );

        return this.props.isRegisterComplete ? onSuccessLayout : registrationForm;
    }

}

const mapStateToProps = state => ({
    isRegisterIn: state.auth.isRegisterIn,
    isRegisterComplete: state.auth.isRegisterComplete,
    registerError: state.auth.registerError,
});

export default connect(mapStateToProps, { registration })(RegistrationForm);
