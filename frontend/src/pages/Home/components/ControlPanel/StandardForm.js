import React, { Component } from "react";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import ControlRow from "./ControlRow";

class StandardForm extends Component{

    constructor(props) {
        super(props);
        this.state = {
            moment: props.moment,
            forms: props.data.map((item, index) => ({isFetched: true, key: item.id, defaultValues: props.data[index]})),
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.data !== this.props.data){
            const forms = this.props.data.map((item, index) => ({
                    isFetched: !!item.id,
                    key: item.id || item.fakeId,
                    defaultValues: this.props.data[index],
                }));
            this.setState({forms});
        }
    }

    addForm = () => {
        const lastForm = this.state.forms[this.state.forms.length - 1];
        const nextKey = !lastForm || typeof lastForm.key === 'string' ? 0 : lastForm.key + 1;
        const newForms = [...this.state.forms, {isFetched: false, key: nextKey, defaultValues: {}}];
        this.setState({forms: newForms});
    };

    remove = key => {
        const forms = [...this.state.forms];
        const index = forms.findIndex(form => form.key === key);
        const { id, date } = forms[index].defaultValues;
        if (index > -1) {
            if (id){
                this.props.remove({id, fakeId: key, date: date || this.state.moment});
            }
            else {
                forms.splice(index, 1);
                this.setState({forms});
            }
        }
    };


    render() {
        return (
            <div>
                {this.state.forms.map(form => (
                    <ControlRow
                        onFinish={this.props.onFinish.bind(null, form.key, form.isFetched)}
                        key={form.key}
                        id={form.key}
                        defaultValues={form.defaultValues}
                        isFetched={form.isFetched}
                        remove={this.remove.bind(null, form.key)}
                        onTypeChange={this.props.onTypeChange}
                        addNewOption={this.props.addNewOption}
                        standardTypes={this.props.standardTypes}
                    />
                ))}

                <Button
                    block
                    type="dashed"
                    onClick={this.addForm}
                >
                    <PlusOutlined /> Додати
                </Button>
            </div>
        );
    }
}

export default StandardForm;
