"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, { useEffect, useState } from "react";
import "../../js/world";

const MapOne: React.FC = () => {
  const [mapData, setMapData] = useState([]);
  const [timeRange, setTimeRange] = useState<string>("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/map?timeRange=${timeRange}`);
        const data = await response.json();

        console.log("Fetched map data:", data);
        setMapData(data);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (mapData.length === 0) return;

    // Filter top 10 countries by sessions
    const top10Countries = [...mapData]
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    // Prepare markers and lines for the map
    const colors = ["#5c5cff", "#ff5050"];
    const markers = top10Countries
      .map((item, index) => ({
        name: item.country,
        coords: getCountryCoordinates(item.country),
        style: { fill: colors[index % colors.length] },
      }))
      .filter((marker) => marker.coords[0] !== 0); // Filter out invalid coordinates

    const lines = top10Countries
      .map((item) => ({
        from: getCountryCoordinates(item.country),
        to: getCountryCoordinates("Canada"), // Toronto coordinates
      }))
      .filter(
        (line) =>
          line.from[0] !== 0 && line.to[0] !== 0 // Filter out invalid lines
      );

    const mapOne = new jsVectorMap({
      selectedRegions: ['EG', 'US'],
      selector: "#mapOne",
      map: "world_merc",
      zoomButtons: true,
      markers: markers,
      lines: lines,
      markerStyle: {
        initial: {
          fill: "#F00",
          stroke: "#000",
          "stroke-width": 1,
          r: 5,
        },
        hover: {
          fill: "#FF0",
          stroke: "#000",
          "stroke-width": 2,
          cursor: "pointer",
        },
      },
      lineStyle: {
        initial: {
          stroke: "#FF0000",
          "stroke-width": 2,
        },
      },
      regionStyle: {
        initial: {
          fill: "#C8D0D8",
          stroke: "#676767",
          strokeWidth: 2.5,
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 1,
          fill: "#3056D3",
        },
        selected: { fill: 'red' },
        selectedHover: { fill: 'purple' }
      },
      regionLabelStyle: {
        initial: {
          fontFamily: "Satoshi",
          fontWeight: "semibold",
          fill: "#000",
        },
        hover: {
          cursor: "pointer",
        },
      },
    });

    return () => {
      const map = document.getElementById("mapOne");
      if (map) map.innerHTML = "";
    };
  }, [mapData]);

  // Function to get coordinates for a country
  const getCountryCoordinates = (country: string) => {
    const coordinates: Record<string, [number, number]> = {
      Canada: [43.65107, -79.347015], // Toronto
      "United States": [37.0902, -95.7129],
      "South Korea": [37.5665, 126.978],
      "Hong Kong": [22.3193, 114.1694],
      Brazil: [-14.235, -51.9253],
      Singapore: [1.3521, 103.8198],
      India: [20.5937, 78.9629],
      Mexico: [23.6345, -102.5528],
      Netherlands: [52.3676, 4.9041],
      China: [35.8617, 104.1954],
    };
    return coordinates[country] || [0, 0]; // Default to [0, 0] if not found
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Top 10 Countries by Sessions
          </h5>
        </div>

        <div>
          <div className="relative z-20 inline-block">
            <select
              name="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
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

      <div className="h-90">
        <div id="mapOne" className="mapOne map-btn"></div>
      </div>
    </div>
  );
};

export default MapOne;
