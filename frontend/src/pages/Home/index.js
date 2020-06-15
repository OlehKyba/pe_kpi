import React, { Component } from "react";
import { connect } from 'react-redux';
import moment from '../../moment';

import {Layout, Menu, Row, Col, Breadcrumb, Divider } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
} from '@ant-design/icons';

import './index.css';

import Charts from "./components/Charts";
import { userFeatch } from "../../redux/actions/authActions";
import { colors } from "../../colors";
import ControlPanel from "./components/ControlPanel";
import {selectMoment} from "../../redux/actions/standardsActions";

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
            collapsed: false,
            path: [this.subMenuKeys.months.value, moment.months(props.selectedDate.month())],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data){
            this.setState({data: this.props.data});
        }
    }


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
        this.setState(newState);
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu
                        //defaultOpenKeys="months"
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
                            <Menu.Item key={this.getKey('user', 'Вийти')}>Вийти</Menu.Item>
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
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Divider plain>Графіки</Divider>
                            <Row justify="center" align="center">
                                <Col span={24} style={{minHeight: '50vh'}}>
                                    <Charts datasets={this.props.datasets}/>
                                </Col>
                            </Row>
                            <Divider plain>Заповнення</Divider>
                            <Row justify="center" align="center">
                                <Col span={24}>
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
                                </Col>
                            </Row>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>KPI PE ©2020</Footer>
                </Layout>
            </Layout>
        );
    }
}

const getData = value => {
    const max = 100;
    const min = 60;
    const length = value.daysInMonth();
    const labels = Array.from({length}, (x, i) => i + 1);
    const firstDataset = Array.from({length: 5}, () => {
        const x = labels[Math.floor(Math.random() * length)];
        const y = Math.floor(Math.random() * (max - min) + min);
        return {x, y};
    });
    const thirdDataset = Array.from({length: 5}, (res, index) => {
        const y = Math.floor(Math.random() * (max - min) + min);
        return {x: index + 1, y};
    });
    const secondDataset = Array.from({length: 5}, () => {
        const x = labels[Math.floor(Math.random() * length)];
        const y = Math.floor(Math.random() * (5 - 1) + 5);
        return {x, y};
    });

    const firstColor = colors.shift();
    const secondColor = colors.shift();
    const thirdColor = colors.shift();
    const bgColors1 = Array.from({length: 5}, () => firstColor);
    const bgColors2 = Array.from({length: 5}, () => secondColor);
    return { labels, datasets: [
            {label: 'First', data: firstDataset, backgroundColor:bgColors1},
            {label: 'Second', data: secondDataset, backgroundColor:bgColors2},
            {label: 'Third', data: thirdDataset, type:'line',
                borderColor: thirdColor,
                backgroundColor: thirdColor,
                pointBorderColor: thirdColor,
                pointBackgroundColor: thirdColor,
                pointHoverBackgroundColor: thirdColor,
                pointHoverBorderColor: thirdColor,
                fill: false,
            },
        ] };
};

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
        return {
            label: item.name,
            type: item.chart,
            data: data[selectedMonth].filter(data => data.type === item.name)
                                     .map(data => ({x: data.date.date(), y: data.value})),
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
    };
};


export default connect(mapStateToProps, { selectMoment })(Home);
