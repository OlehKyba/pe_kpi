import React, { Component } from "react";

import { Form, Input, Button, Result } from 'antd';
import { MailOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';


class RegistrationForm extends Component{
    state = {
        isSubmit: false,
    }

    onFinish = () => {
        this.setState({isSubmit: true})
    };

    render() {
        return this.state.isSubmit ?
            <Result
                className="auth"
                title="Перевірте вашу електронну пошту, ми вислали вам лист для підтвердження email!"
            />
            :
            (<section className="auth">
                <div className="auth--top">
                    <h2>Реєстрація</h2>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
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
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="E-mail" />
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
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Зареєструватися
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        );
    }

}

export default RegistrationForm;
