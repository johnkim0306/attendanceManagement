'use client'; // This is necessary for using React hooks in Next.js app folder

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts since it's a client-side component
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DeviceCategoryChart = () => {
  const [chartData, setChartData] = useState<any>([]);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<string>('monthly'); // State to track time range

  // Fetch data from your API route based on time range
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/deviceCategory?timeRange=${timeRange}`);
        const data = await response.json();
        setChartData(data);

        // Calculate total sessions for percentage computation
        const total = data.reduce((acc: number, item: { sessions: number }) => acc + item.sessions, 0);
        setTotalSessions(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeRange]); // Re-run when timeRange changes

  // Prepare data for the chart
  const deviceCategories = chartData.map((item: { deviceCategory: string }) => item.deviceCategory);
  const sessions = chartData.map((item: { sessions: number }) => item.sessions);

  const options: ApexOptions = {
    chart: {
      id: 'device-category-chart',
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    labels: deviceCategories,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Visitors Analytics
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="timeRange"
              value={timeRange} // Bind the state to the dropdown
              onChange={(e) => setTimeRange(e.target.value)} // Update state on change
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="weekly" className="dark:bg-boxdark">
                Weekly
              </option>
              <option value="monthly" className="dark:bg-boxdark">
                Monthly
              </option>
              <option value="yearly" className="dark:bg-boxdark">
                Yearly
              </option>
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={sessions} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {chartData.map((item: { deviceCategory: string; sessions: number }, index: number) => {
          const percentage = ((item.sessions / totalSessions) * 100).toFixed(1); // Compute percentage
          const colors = ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#3AD563"]

          return (
            <div key={index} className="w-full px-8 sm:w-1/2">
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span>{item.deviceCategory}</span>
                  <span>{percentage}%</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceCategoryChart;
