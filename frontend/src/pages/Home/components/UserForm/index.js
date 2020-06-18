import React, { useEffect } from "react";
import {Button, Form, Input, Space, Card} from "antd";

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 18 },
};

const UserForm = props => {

    const [form] = Form.useForm();
    useEffect(() => form.resetFields(), [props.initialValues]);

    return (
        <Space size="large" style={{height: '80vh', display: "flex", justifyContent: "center"}}>
            <Card title="Інформація">
                <Form
                    {...layout}
                    form={form}
                    onFinish={props.onFinish}
                >
                    <Form.Item
                        label="Ім'я"
                        name="name"
                        initialValue={props.initialValues.name ? props.initialValues.name : ''}
                        rules={[
                            {
                                required: true,
                                message: 'Це поле не може бути пустим!',
                            },
                        ]}
                    >
                        <Input placeholder="Ім'я"/>
                    </Form.Item>

                    <Form.Item
                        name="surname"
                        label="Прізвище"
                        initialValue={props.initialValues.surname ? props.initialValues.surname : ''}
                        rules={[
                            {
                                required: true,
                                message: 'Це поле не може бути пустим!',
                            },
                        ]}
                    >
                        <Input placeholder="Прізвище" />
                    </Form.Item>

                    <Form.Item
                        name="group"
                        label="Група"
                        initialValue={props.initialValues.group ? props.initialValues.group : ''}
                        rules={[
                            {
                                required: true,
                                message: 'Це поле не може бути пустим!',
                            },
                        ]}
                    >
                        <Input placeholder="Група"/>
                    </Form.Item>

                    <Form.Item
                        name="club"
                        label="Cекція"
                        initialValue={props.initialValues.club ? props.initialValues.club : ''}
                        rules={[
                            {
                                required: true,
                                message: 'Це поле не може бути пустим!',
                            },
                        ]}
                    >
                        <Input placeholder="Секція"/>
                    </Form.Item>

                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                    >
                        Оновити данні
                    </Button>
                    <Button
                        block
                        danger
                        style={{marginTop: '1rem'}}
                        onClick={props.removeUser}
                    >
                        Видалити
                    </Button>
                </Form>
            </Card>
        </Space>
    );
};

export default UserForm;
