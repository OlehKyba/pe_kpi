import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Form, Input, Button, Result, Alert, Spin } from 'antd';
import {
    MailOutlined,
    LockOutlined,
    UnlockOutlined,
    UserOutlined,
    TeamOutlined,
    BlockOutlined,
    DribbbleOutlined,
} from '@ant-design/icons';

import { registration } from "../../../../redux/actions/authActions";


class RegistrationForm extends Component {
    state = {
        msg: null,
        isInProcess: false,
    }

    message = errorCode => {
        switch (errorCode) {
            case 409:
                return 'Користувач з таким email вже існує!'
            default:
                return null;
        }
    }

    onSubmit = data => {
        const {confirm, ...user} = data;
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
                    <Link to="/sign-up/retry-verify">
                        <Button type="primary">
                            Надіслати лист
                        </Button>
                    </Link>
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
                        name="register_form"
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
                            />
                        </Form.Item>

                        <Form.Item
                            hasFeedback
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Це поле не може бути пустим!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon"/>}
                                placeholder="Ім'я"
                            />
                        </Form.Item>

                        <Form.Item
                            hasFeedback
                            name="surname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Це поле не може бути пустим!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<TeamOutlined className="site-form-item-icon"/>}
                                placeholder="Прізвище"
                            />
                        </Form.Item>

                        <Form.Item
                            hasFeedback
                            name="group"
                            rules={[
                                {
                                    required: true,
                                    message: 'Це поле не може бути пустим!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<BlockOutlined />}
                                placeholder="Група"
                            />
                        </Form.Item>

                        <Form.Item
                            hasFeedback
                            name="club"
                            rules={[
                                {
                                    required: true,
                                    message: 'Це поле не може бути пустим!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<DribbbleOutlined />}
                                placeholder="Спортивна секція"
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
                            <Button htmlType="submit" type="primary" className="login-form-button">
                                Зареєструватися
                            </Button>
                        </Form.Item>
                    </Form>
                    {this.state.msg ? <Alert showIcon message={this.state.msg} type="error"/> : null}
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
