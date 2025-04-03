import React, { useState } from "react";
import Chart from "react-apexcharts";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PriceRangeChart = () => {
  const [range, setRange] = useState([50, 150]);
  const [chartData] = useState({
    series: [
      {
        name: "Prices",
        data: [3, 5, 7, 10, 9, 11, 12, 14, 15, 33, 10, 8, 5, 3],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "10px",
          endingShape: "flat",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [""],
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        show: false, // Hide the Y-axis labels if you don't want them
      },
      fill: {
        colors: ["#525B31"], // The green color in the bars
      },
      grid: {
        show: false, // Hide the grid if you want a cleaner look
      },
      tooltip: {
        enabled: false,
      },
    },
  });

  const handleRangeChange = (value) => {
    setRange(value);
    console.log("Selected range:", value); // You can update the chart data or use the range in other logic
  };

  return (
    <div className="chart-container">
      <div className="pt-2 pl-2">
        <h3 className="text-lg font-bold text-[#525B31]">Price range</h3>
        <p className="text-sm text-[#525B31]">
          Average price per night is{" "}
          <span className="text-[#DAA520]">$190</span>
        </p>
      </div>

      <div className="px-2 mt-[-25px]">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={150}
        />
        <div>
          <div className="mt-[-40px]">
            <Slider
              range
              min={0}
              max={200}
              step={1}
              value={range}
              onChange={handleRangeChange}
              trackStyle={[{ backgroundColor: "#525B31" }]} // Customize slider track
              handleStyle={[
                { borderColor: "#525B31", backgroundColor: "#fff" },
              ]} // Customize slider handles
            />
            <div className="flex justify-between text-sm">
              <span>${range[0]}</span>
              <span>${range[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeChart;
