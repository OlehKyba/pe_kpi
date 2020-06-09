import React, { Component } from "react";
import { connect } from 'react-redux';

import { userFeatch } from "../../redux/actions/authActions";

class Home extends Component {

    componentDidMount() {
        this.props.userFeatch();
    }

    render() {
        return (
            <section className="home">
                <p>This is home page!</p>
            </section>
        );
    }
}

export default connect(null, { userFeatch })(Home);
