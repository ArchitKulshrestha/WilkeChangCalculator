"use client";
import { get, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState({
    temperature: 0,
    diffusivity: null,
  });

  const onSubmit = (data) => {
    if (data.solvent == data.soluteMolalVolume) {
      alert("Association Coefficient and soluteMolalVolume cannot be same");
      return;
    }
    setLoading(true);
    fetch("/api/diffusivity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center flex-col justify-center px-5">
      <form
        className="w-full sm:w-[50%] mx-auto mt-8"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="solvent"
            className="block text-gray-700 text-sm font-bold mb-2">
            Association Coefficient(φ)
          </label>
          <select
            required
            {...register("solvent")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={2.26}>
            <option value="2.26">Water</option>
            <option value="1.5">Ethanol</option>
            <option value="1.9">Methanol</option>
            <option value="1">Benzene</option>
            <option value="1">Hexane</option>
            <option value="1">Toluene</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="solventMolarMass"
            className="block text-gray-700 text-sm font-bold mb-2">
            solventMolarMass (g/mol)
          </label>
          <input
            required
            {...register("solventMolarMass")}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="solventViscosity"
            className="block text-gray-700 text-sm font-bold mb-2">
            solventViscosity (Pa.s)
          </label>
          <input
            required
            {...register("solventViscosity")}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="soluteMolalVolume"
            className="block text-gray-700 text-sm font-bold mb-2">
            soluteMolalVolume (m3/Kmol)
          </label>
          <select
            required
            {...register("soluteMolalVolume")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={1.5}>
            <option value="2.26">Water</option>
            <option value="1.5">Ethanol</option>
            <option value="1.9">Methanol</option>
            <option value="1">Benzene</option>
            <option value="1">Hexane</option>
            <option value="1">Toluene</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="temperature"
            className="block text-gray-700 text-sm font-bold mb-2">
            Temperature (kelvin)
          </label>
          <input
            required
            {...register("temperature")}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit
          </button>
        </div>
      </form>
      <div className="mb-4 text-gray-800 font-bold text-center">
        {loading ? (
          "Calculating..."
        ) : (
          <p>
            Diffusivity: {Data.diffusivity}
            (m^2/s)
          </p>
        )}

        <Link href="/graph">
          <p className="text-blue-500">View Graph</p>
        </Link>
      </div>
    </section>
  );
}
