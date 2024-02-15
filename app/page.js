"use client";
import { get, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState({
    temperature: 273.15,
    diffusivity: null,
  });

  const onSubmit = (data) => {
    setLoading(true);
    fetch("/api/diffusivity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        // Log the response data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <section className="min-h-screen flex items-center flex-col justify-center px-5">
      <form
        className="w-full sm:w-1/2 mx-auto mt-8"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="solvent" className="block text-sm font-bold mb-2">
            Association Coefficient(φ)
          </label>
          <select
            required
            {...register("solvent")}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
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
            className="block text-sm font-bold mb-2">
            Solvent Molar Mass (g/mol)
          </label>
          <input
            required
            {...register("solventMolarMass")}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="solventViscosity"
            className="block text-sm font-bold mb-2">
            Solvent Viscosity (Pa.s)
          </label>
          <input
            required
            {...register("solventViscosity")}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="soluteMolalVolume"
            className="block text-sm font-bold mb-2">
            Solute Molal Volume (m3/Kmol)
          </label>
          <select
            required
            {...register("soluteMolalVolume")}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={0.0592}>
            <option value="0.0148">Water</option>
            <option value="0.0592">Ethanol</option>
            <option value="0.037">Methanol</option>
            <option value="0.096">Benzene</option>
            <option value="0.1406">Hexane</option>
            <option value="0.1182">Toluene</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="temperature" className="block text-sm font-bold mb-2">
            Temperature (Kelvin)
          </label>
          <input
            required
            {...register("temperature")}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Calculate
          </button>
        </div>
      </form>
      <div className="mb-4 font-bold text-center">
        {loading ? (
          "Calculating..."
        ) : (
          <p>Diffusivity: {Data.diffusivity} &nbsp; (m^2/s)</p>
        )}

        <Link href="/graphgoogle">
          <p className="bg-blue-100 hover:bg-blue-200 text-blue-500 font-bold py-2 px-4 rounded mt-4 inline-block cursor-pointer">
            View Graph
          </p>
        </Link>
      </div>
    </section>
  );
}
