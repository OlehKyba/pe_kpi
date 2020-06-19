import React from "react";
import {Space, Alert, Button, Col} from "antd";
import { connect } from "react-redux";

import { reportRequest } from "../../../../redux/actions/reportActions";

const ReportPanel = props => {

    const onClick = () => {
        console.log(props);
        props.reportRequest({month: props.currentMonth});
    };

    const dangerAlert = (
        <Alert
            showIcon
            closable
            type="danger"
            message='Щось пішло не так!'
        />
    );

    const successAlert = (
        <Alert
            showIcon
            closable
            type="success"
            message='Перевірте вашу пошту!'
        />
    )

    return (
        <Col size="large">
            <Button
                style={{marginBottom: '1rem'}}
                loading={props.reportsRequested.includes(props.month)}
                block
                type="primary"
                onClick={onClick}
            >
                Вислати журнал
            </Button>
            {props.error ? dangerAlert : null}
            {props.isSuccess ? successAlert : null}
        </Col>
    );
}

const mapStateToProps = state => {
    return {
        error: state.reports.error,
        reportsRequested: state.reports.reportsRequested,
        currentMonth: state.standards.selectedDate.month(),
        isSuccess: state.reports.isSuccess,
    };
};
export default connect(mapStateToProps, { reportRequest })(ReportPanel);
