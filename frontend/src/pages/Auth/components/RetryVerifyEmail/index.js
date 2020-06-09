import React, { Component } from "react";
import { connect } from 'react-redux';

import {Form, Input, Button, Result} from 'antd';
import { MailOutlined } from '@ant-design/icons';

class RetryVerifyEmailForm extends Component{

    state = {
        isSubmit: false,
    }

    onSubmit = () => {
        this.setState({isSubmit: true})
    }

    render() {
        return this.state.isSubmit ?
            <Result
                className="auth"
                title="Перевірте вашу електронну пошту, ми вислали вам лист з посиланням для зміни пароля!"
            />
            :
            (
                <section className="auth">
                    <div className="auth--top">
                        <h2>Забули пароль?</h2>
                        <p>Введіть ваш email, ми відправимо лист з посиланням для зміни пароля.</p>
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
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="E-mail" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Відправити лист
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            );
    }

}

export default ForgotPasswordForm;
