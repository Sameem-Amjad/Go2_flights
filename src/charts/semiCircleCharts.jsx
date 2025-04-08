import React from 'react';
// import './module/semiCircle.module.css';
const SemiCircleChart = ({ value, name }) => {

    return (
        <div

            role="progress-bar"
            aria-valuenow={value}
            aria-valuemin="0"
            aria-valuemax="100"
            className="progress-bar"
            style={{ "--value": value }}
        >
            <div className={`${name == "Low" ? "absolute" : "hidden"} stick-class bg-white`} ></div>
            <div className={`${name == "Medium" ? "absolute" : "hidden"} stick-class1 bg-white`} ></div>
            <div className={`${name == "High" ? "absolute" : "hidden"} stick-class2 bg-white`} ></div>
            <div className={`${name == "Extreme" ? "absolute" : "hidden"} stick-class3 bg-white`} ></div>

            <svg className=' lg:absolute md:absolute sm:absolute absolute svg-class' width="400" height="auto" viewBox="0 40 300 100">
                <defs>
                    <path id="curve" d="M 50,150 A 100,100 0 0,1 250,150" />
                </defs>
                <text className='svg-text' font-size="14" fill="white">
                    <textPath href="#curve" startOffset="48%" text-anchor="middle">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Low&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;Medium&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; High&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Extreme
                    </textPath>
                </text>
            </svg>
            <div className='h-full w-1 bg-black absolute'> </div>
            <div className=' div-class w-1 bg-black lg:absolute md:absolute sm:absolute '> </div>
            <div className='div2-class w-1 bg-black lg:absolute md:absolute sm:absolute '> </div>
            <div className=' w-10 h-5 border-4 border-b-white border-t-black border-r-black border-l-black rounded-t-full bg-white absolute'></div>

        </div>
    );
};

export default SemiCircleChart;