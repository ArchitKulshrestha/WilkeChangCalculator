"use client";
import React from "react";
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
export const dynamic = "force-dynamic";
const Dummy = () => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/get_diffusivity", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setGraphData(data.graphData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const deleteData = () => {
    fetch("/api/delete", {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setGraphData([]);
        router.push("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const diffusivity = graphData.map((item) => item.diffusivity);
  const temperature = graphData.map((item) => parseFloat(item.temperature));

  const options = {
    pointSize: 5,
    legend: "none",
    hAxis: {
      title: "Temperature",
    },
    vAxis: {
      title: "Diffusivity",
      format: "scientific",
    },
  };

  return (
    <section className="px-4 sm:px-16 flex flex-col justify-center overflow-auto">
      {loading ? (
        "Loading... "
      ) : (
        <div>
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
          <Chart
            chartType="LineChart"
            data={[["Temperature", "Diffusivity"]].concat(
              diffusivity.map((item, index) => [temperature[index], item])
            )}
            options={options}
            className="sm:w-4/5 w-[500px] h-[500px]"
          />
          <div className="flex flex-col mt-4">
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
          </div>
        </div>
      )}
    </section>
  );
};

export default Dummy;
