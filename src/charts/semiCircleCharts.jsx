import React from 'react';
// import './module/semiCircle.module.css';
const SemiCircleChart = ({ value }) => {

    return (
        <div

            role="progress-bar"
            aria-valuenow={value}
            aria-valuemin="0"
            aria-valuemax="100"
            className="progress-bar"
            style={{ "--value": value }}
        >

        </div>
    );
};

export default SemiCircleChart;