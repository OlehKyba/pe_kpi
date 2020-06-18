import React, { Component } from "react";
import { connect } from 'react-redux';
import moment from '../../moment';

import {Layout, Menu, Row, Col, Breadcrumb, Divider, Spin, Result } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
} from '@ant-design/icons';

import './index.css';

import Charts from "./components/Charts";
import ControlPanel from "./components/ControlPanel";
import UserForm from "./components/UserForm";
import { readStandards, selectMoment } from "../../redux/actions/standardsActions";
import { logout } from "../../redux/actions/authActions";
import { getUserData, updateUserData, deleteUser } from "../../redux/actions/userActions";

const { Content, Sider, Footer } = Layout;
const { SubMenu } = Menu;


const mapDataToMoment = (date, data) => {
    const month = moment.months(date.month());
    const currentDate = date.date();
    return data[month].filter(item => item.date.date() === currentDate);
};

class Home extends Component {

    subMenuKeys = {
        months: {
            name: 'months',
            value: 'Місяць',
        },
        user: {
            name: 'user',
            value: 'Користувач',
        },
    };

    getKey = (category, value) => `${this.subMenuKeys[category].value}-${value}`;

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            terms: props.terms,
            moment: props.selectedDate,
            collapsed: true,
            path: [this.subMenuKeys.months.value, moment.months(props.selectedDate.month())],
            user: props.user,
            isUserInProcess: props.isUserInProcess,
            userError: props.userError,
        }
    }

    componentDidMount() {
        const month = this.state.moment.month() + 1;
        const year = this.state.moment.year();
        this.props.readStandards({ month, year });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data){
            this.setState({data: this.props.data});
        }
        if (this.props.selectedDate !== prevProps.selectedDate){
            let month = this.props.selectedDate.month();
            const monthName = moment.months(month);
            const thunkedMonth = month + 1;
            const year = this.props.selectedDate.year();
            if (this.state.data[monthName].length === 0){
                this.props.readStandards({month: thunkedMonth, year});
            }
        }
        if (this.props.user !== prevProps.user || this.props.userError !== prevProps.userError || this.props.isUserInProcess !== prevProps.isUserInProcess){
            this.setState({
                user: this.props.user,
                isUserInProcess: this.props.isUserInProcess,
                userError: this.props.userError,
            })
        }
    }

    onUserDataUpdate = data => {
       this.props.updateUserData(data);
    };

    onUserDelete = () => {
        this.props.deleteUser();
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    onSubMenuSelect = ({ key }) => {
        const newState = {};
        newState.path = key.split('-');
        if(newState.path[0] === this.subMenuKeys.months.value){
            const [firstTermYear, secondTermYear] = this.state.terms;
            const year = moment().month(newState.path[1]).format('M') > 7 ? firstTermYear : secondTermYear;
            const date = moment().year(year).month(newState.path[1]).date(1);
            newState.moment = date;
            this.props.selectMoment({moment: date});
        }
        else if(newState.path[0] === this.subMenuKeys.user.value){
            if (Object.keys(this.state.user).length < 1){
                this.props.getUserData();
            }
        }
        this.setState(newState);
    };

    render() {
        const isSpinning = this.props.readTemporaryStorage.length > 0;
        const monthLayout = (
            <div className="site-layout-background" style={{ padding: 24, height: '385px' }}>
                <Divider plain>Графіки</Divider>
                <Row justify="center" align="center">
                    <Col span={24}>
                        <Spin spinning={isSpinning}>
                            <Charts
                                datasets={this.props.datasets}
                            />
                        </Spin>
                    </Col>
                </Row>
                <Divider plain>Заповнення</Divider>
                <Row justify="center" align="center">
                    <Col span={24}>
                        <Spin spinning={isSpinning}>
                            <ControlPanel
                                active={this.state.moment.date() - 1}
                                data={
                                    Array.from({length: this.state.moment.daysInMonth()},
                                        (item, index) => {
                                            const month = this.state.moment.month();
                                            const year = this.state.moment.year();
                                            const date = moment({ date: index + 1, month, year});
                                            const standards = mapDataToMoment(date, this.state.data);
                                            return [date, standards];
                                        }
                                    )}
                            />
                        </Spin>
                    </Col>
                </Row>
            </div>
        );

        const userDetailsLayout = (
            <Spin spinning={this.state.isUserInProcess}>
                <UserForm
                    initialValues={this.state.user}
                    onFinish={this.onUserDataUpdate}
                    removeUser={this.onUserDelete}
                />
            </Spin>
        );

        const successLayout = this.state.path[0] === this.subMenuKeys.months.value ? monthLayout : userDetailsLayout;
        //const successLayout = monthLayout;
        const errorLayout = (
            <div className="site-layout-background" style={{ padding: 24, minHeight: '500px' }}>
                <Result
                    status="500"
                    title="Упс!"
                    subTitle="Щось пішло не так :("
                />
            </div>
        );

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu
                        //defaultOpenKeys={[this.subMenuKeys.months.name]}
                        theme="dark"
                        defaultSelectedKeys={[this.getKey('months', moment.months(this.state.moment.month()))]}
                        mode="inline"
                        onSelect={this.onSubMenuSelect}
                    >
                        <SubMenu
                            key={this.subMenuKeys.months.name}
                            icon={<CalendarOutlined />}
                            title={this.subMenuKeys.months.value}
                        >
                            {Object.keys(this.state.data).map(monthName => (
                                <Menu.Item
                                    key={this.getKey('months', monthName)}
                                    style={{textTransform: 'capitalize'}}
                                >
                                    {monthName}
                                </Menu.Item>
                            ))}
                        </SubMenu>

                        <SubMenu
                            key={this.subMenuKeys.user.name}
                            icon={<UserOutlined />}
                            title={this.subMenuKeys.user.value}
                        >
                            <Menu.Item key={this.getKey('user', 'Інформація')}>Інформація</Menu.Item>
                            <Menu.Item onClick={this.props.logout} key={this.getKey('user', 'Вийти')}>Вийти</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0', textTransform: 'capitalize' }}>
                            { this.state.path.map(item => (
                                <Breadcrumb.Item key={item}>
                                {item}
                                </Breadcrumb.Item>))
                            }
                        </Breadcrumb>
                        { this.props.readError || this.props.userError ? errorLayout : successLayout }
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>KPI PE ©2020</Footer>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToDatasets = standardsState => {
    const { selectedDate, standardTypes, data } = standardsState;
    const selectedMonth = moment.months(selectedDate.month());
    const datasets = standardTypes.map(item => {
        const color = item.color;
        const colorSettings = item.chart === 'bar' ? { backgroundColor: color} : {
            borderColor: color,
            backgroundColor: color,
            pointBorderColor: color,
            pointBackgroundColor: color,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: color,
            fill: false,
        };
        let dataset = data[selectedMonth].filter(data => data.type === item.name)
                                         .map(data => ({x: data.date.date(), y: data.value}))
        if (item.chart === 'bar') {
            dataset = dataset.reduce((unique, item) => {
                const index = unique.findIndex(element => element.x === item.x);
                if (index === -1){
                    return [...unique, item];
                }
                else if (unique[index].y < item.y){
                    unique.splice(index, 1, item);
                }
                return unique;
            }, []);
        }
        return {
            label: item.name,
            type: item.chart,
            data: dataset,
            ...colorSettings,
        };
    });
    const length = selectedDate.daysInMonth();
    const labels = Array.from({length}, (x, i) => i + 1);
    return { labels, datasets };
};

const mapStateToProps = state => {
    return {
        selectedDate: state.standards.selectedDate,
        data: state.standards.data,
        terms: state.standards.terms,
        datasets: mapStateToDatasets(state.standards),
        readTemporaryStorage: state.standards.readTemporaryStorage,
        readError: state.standards.errors.read,
        userError: state.users.error,
        user: state.users.user,
        isUserInProcess: state.users.isReading || state.users.isUpdating || state.users.isDeleting,
    };
};


export default connect(mapStateToProps, {
    selectMoment,
    readStandards,
    logout,
    getUserData,
    updateUserData,
    deleteUser
})(Home);
