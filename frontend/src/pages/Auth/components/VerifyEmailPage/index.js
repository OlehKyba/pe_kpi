import React, { useEffect }from "react";
import { Link, useParams } from 'react-router-dom';
import { connect } from "react-redux";

import { Button, Result, Spin, Space } from "antd";

import { verifyEmail } from "../../../../redux/actions/authActions";


const onErrorMessage = errorCode => {
    switch (errorCode) {
        case 404:
            return {
                status: 404,
                title: 'Помилка',
                subtitle: 'Користувач з таким email не існує!',
                extra: () => null,

            };
        case 401:
            return {
                status: "error",
                title: 'Упс!',
                subtitle: 'Щось пішло не так. Можливо, час на підтвердження пошти вийшов. Спробуйте підтвердити вашу пошту ще раз.',
                extra: onClick => (<Button danger onClick={onClick}>Надіслати лист</Button>),
            };
        default:
            return {
                status: "error",
                title: 'Помилка',
                subtitle: 'Щось пішло не так.',
                extra: () => null,

            };
    }
};

const onSuccessMessage = () => ({
    status: "success",
    title: "Успіх",
    subtitle: "Вітаємо! Ви підтвердили вашу електронну пошту.",
    extra: () => null,
});


const VerifyEmailPage = props => {
    let { token } = useParams();
    useEffect(() => {
        props.verifyEmail({token});
    }, []);

    if(props.isVerifiedEmail){
        const result = props.verifyEmailError ? onErrorMessage(props.verifyEmailError.code) : onSuccessMessage();
        return (
            <Result
                className="auth"
                status={result.status}
                title={result.title}
                subTitle={result.subtitle}
                extra={result.extra()}
            />
        );
    }
    return (
        <Space size="large">
            <Spin
                spinning
                size="large"
            />
        </Space>
    );
};


const mapStateToProps = state => {
    return {
        isInProcess: state.auth.isVerifyingEmail,
        isVerifiedEmail: state.auth.isVerifiedEmail,
        verifyEmailError: state.auth.verifyEmailError,
    }
};

export default connect(mapStateToProps, { verifyEmail })(VerifyEmailPage);
