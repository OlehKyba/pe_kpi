import React, { Component } from "react";
import { Collapse } from "antd";

import {connect} from "react-redux";
import {
    addStandardType,
    createStandard,
    deleteStandard,
    updateStandard
} from "../../../../redux/actions/standardsActions";
import StandardForm from "./StandardForm";

class ControlPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            data: this.props.data,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data){
            this.setState({data: this.props.data});
        }
    }

    onNameChange = event => {
        this.setState({
            name: event.target.value,
        });
    };

    addItem = () => {
        const { name } = this.state;
        if (name && !this.props.standardTypes.includes(name)){
            this.props.addStandardType({ name });
        }
    };

    onFinish = (date, key, isFetched, data) => {
        const {type, value} = data;
        if (isFetched){
            this.props.updateStandard({type, value, date, id: key});
        }
        else {
            this.props.createStandard({type, value, date, fakeId: key})
        }
    };

    render() {
        return (
            <Collapse accordion defaultActiveKey={[this.props.active]}>
                { this.state.data.map((item, index) => {
                    const [date, data] = item;
                    return (
                        <Collapse.Panel header={date.format('L')} key={index}>
                            <StandardForm
                                onFinish={this.onFinish.bind(null, date)}
                                moment={date}
                                data={data}
                                standardTypes={this.props.standardTypes}
                                onTypeChange={this.onNameChange}
                                addNewOption={this.addItem}
                            />
                        </Collapse.Panel>
                    );
                })}
            </Collapse>
        );
    }
}

const mapStateToProps = state => {
    return {
        standardTypes: state.standards.standardTypes.map(obj => obj.name),
        standards: state.standards.data,
    };
}

export default connect(mapStateToProps, { createStandard, deleteStandard, updateStandard, addStandardType })(ControlPanel);
