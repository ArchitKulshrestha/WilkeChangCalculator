"use client";
import React, { useEffect, useState } from "react";
import createPlotlyComponent from "react-plotlyjs";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import plotly from "plotly.js/dist/plotly";
import createPlotComponent from "react-plotly.js/factory";
const PlotlyComponent = createPlotlyComponent(plotly);
const Graph = () => {
  const router = useRouter();
  const [graphData, setGraphData] = useState([]);
  const [data, setData] = useState([]);
  const [layout, setLayout] = useState({});
  const [config, setConfig] = useState({});

  useEffect(() => {
    // fetch the data
    fetch("/api/diffusivity", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setGraphData(data.graphData);
      });
  }, []);
  useEffect(() => {
    if (graphData.length > 0) {
      const temperature = graphData.map((item) => item.temperature);
      const diffusivity = graphData.map((item) => item.diffusivity);
      console.log(temperature, diffusivity);
      const data = [
        {
          x: temperature,
          y: diffusivity,
          type: "scatter",
          mode: "points",
          marker: { color: "blue" },
        },
      ];
      setData(data);
      const layout = {
        title: "Temperature vs Diffusivity",
        xaxis: {
          title: "Temperature",
          titlefont: {
            family: "Arial, sans-serif",
            size: 18,
            color: "lightgrey",
          },
          showticklabels: true,
          tickangle: "auto",
          tickfont: {
            family: "Old Standard TT, serif",
            size: 14,
            color: "black",
          },

          exponentformat: "e",
          showexponent: "all",
        },
        yaxis: {
          title: "Diffusivity",
          titlefont: {
            family: "Arial, sans-serif",
            size: 18,
            color: "lightgrey",
          },
          showticklabels: true,
          tickangle: 45,
          tickfont: {
            family: "Old Standard TT, serif",
            size: 14,
            color: "black",
          },
          exponentformat: "e",
          showexponent: "all",
        },

        yref: "paper",
        automargin: true,
      };
      setLayout(layout);
      const config = {
        showLink: false,
        displayModeBar: true,
        responsive: true,
      };
      setConfig(config);
    }
  }, [graphData]);
  const deleteData = () => {
    fetch("/api/diffusivity", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        setGraphData([]);
        router.push("/");
      });
  };

  return (
    <section className="px-4 flex flex-col justify-center">
      <h1 className="text-2xl font-bold my-4">Graph</h1>
      {graphData.length > 0 ? (
        <div>
          <h2 className="font-semibold mb-2">Temperature vs Diffusivity</h2>
          <div>
            {graphData.map((item, index) => {
              return (
                <div className="flex" key={index}>
                  <p className="border-2 px-6 py-1 w-[100px]">
                    {item.temperature}
                  </p>
                  <p className="border-2 px-6 py-1 w-[200px]">
                    {item.diffusivity}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Link
          className="border-2 px-4 py-2 w-[200px] text-center hover:bg-gray-400 bg-gray-200 rounded-md"
          href="/">
          Add Data
        </Link>
      )}
      <Suspense fallback={<div>Loading</div>}>
        <PlotlyComponent
          className="whatever"
          data={data}
          layout={layout}
          config={config}
        />
      </Suspense>
      <Link
        className="border-2 px-4 py-2 w-[200px] text-center hover:bg-gray-400 bg-gray-200 rounded-md"
        href="/">
        Add more Data
      </Link>

      <button
        className="bg-red-600 rounded-md hover:bg-red-800 px-4 py-2 w-[200px] text-white mt-4 mb-8"
        onClick={deleteData}>
        Delete Data
      </button>
    </section>
  );
};

export default Graph;