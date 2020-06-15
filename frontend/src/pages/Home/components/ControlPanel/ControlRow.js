import React from "react";
import { Button, Divider, Form, Input, InputNumber, Select, Space } from "antd";
import { MinusOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import {connect} from "react-redux";


const ControlRow = props => {

    const createButton = (
        <Button
            loading={props.createTemporaryStorage.some(item => item === props.id)}
            htmlType="submit"
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
        />
    );
    const updateButton = (<Button htmlType="submit" shape="circle" icon={<UpOutlined />} />);

    return (
        <Form
            onFinish={props.onFinish}
            onFieldsChange={props.onChange}
        >
            <Space style={{ display: 'flex', marginBottom: 8, justifyContent: 'center' }}
                   align="start">
                <Form.Item
                    initialValue={props.defaultValues ? props.defaultValues.type : null}
                    name='type'
                    fieldKey='type'
                    rules={[{ required: true, message: 'Ви маєте вибрати тип!' }]}
                >
                    <Select
                        style={{ width: 240 }}
                        placeholder="Оберіть тип нормативу"
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: '4px 0' }} />
                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    <Input style={{ flex: 'auto' }} onChange={props.onTypeChange}/>
                                    <Button
                                        type="link"
                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                        onClick={props.addNewOption}
                                    >
                                        <PlusOutlined /> Add item
                                    </Button>
                                </div>
                            </div>
                        )}
                    >
                        {props.standardTypes.map(item => (
                            <Select.Option value={item} key={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    initialValue={props.defaultValues ? props.defaultValues.value : null}
                    name='value'
                    fieldKey='value'
                    rules={[{ required: true, message: 'Заповніть значення!' }]}
                >
                    <InputNumber min={0} step={0.1} />
                </Form.Item>

                { props.isFetched ? updateButton : createButton }
                <Button
                    type="primary"
                    danger
                    shape="circle"
                    icon={<MinusOutlined />}
                    onClick={props.remove}
                />
            </Space>
        </Form>

    );
};

const mapStateToProps = state => {
    return {
        createTemporaryStorage: state.standards.createTemporaryStorage,
    };
};

export default connect(mapStateToProps)(ControlRow);
