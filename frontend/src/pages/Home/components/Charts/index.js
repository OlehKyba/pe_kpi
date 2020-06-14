import React from "react";
import moment from "moment";
import {Bar} from "react-chartjs-2";

const Charts = props => {
    return (
        <Bar
        data={props.datasets}
        options={{
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                    }
                }]
            }
        }}
        />
    );
};

export default Charts;
