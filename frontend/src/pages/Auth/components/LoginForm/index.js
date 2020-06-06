import React from "react";
import { Link } from 'react-router-dom';

import { Form, Input, Button, Checkbox} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const onFinish = values => {
    console.log('Received values of form: ', values);
};

const LoginForm = () => {
    return (
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
                onFinish={onFinish}
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
        </section>
    );
}

export default LoginForm;
