import React from 'react';
import { Card, Avatar } from 'antd';
import axios from 'axios';
import './App.css';


const { Meta } = Card;

class App extends React.Component {
    state = {
        loading: true,
        persons: [
            {
                email: 'example@gmail.com',
                description: 'Example',
            },
            {
                email: 'example@gmail.com',
                description: 'Example',
            },
            {
                email: 'example@gmail.com',
                description: 'Example',
            },
        ],
    };


    render() {
        const {loading} = this.state;

        return (
            <div>

                <Card style={{width: 300, marginTop: 16}} loading={loading}>
                    <Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                        }
                        title={this.state.persons[0].email}
                        description={this.state.persons[0].description}
                    />
                </Card>

                <Card style={{width: 300, marginTop: 16}} loading={loading}>
                    <Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                        }
                        title={this.state.persons[1].email}
                        description={this.state.persons[1].description}
                    />
                </Card>

                <Card style={{width: 300, marginTop: 16}} loading={loading}>
                    <Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                        }
                        title={this.state.persons[2].email}
                        description={this.state.persons[2].description}
                    />
                </Card>

            </div>
        );
    }

    componentDidMount() {
        axios.get('/api/users')
            .then(response => {
                console.log(response);
                const data = response.data.data
                    .map(person => {
                        return {
                        email: person.email,
                        description:`This is user: ${person.name} ${person.surname} ${person.patronymic}.`,
                        }
                    });
                console.log(data);
                this.setState({
                    persons: data,
                    loading: false,
                })
            });

    }
}

export default App;
