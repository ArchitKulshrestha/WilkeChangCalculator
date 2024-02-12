import { connectToDB } from "@/utils/db";
import graphs from "@/utils/diffusivity";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const {
    temperature,
    solvent,
    solventViscosity,
    soluteMolalVolume,
    solventMolarMass,
  } = await request.json();

  try {
    await connectToDB();

    const getDiffusivity = (
      temperature,
      solvent,
      solventMolarMass,
      solventViscosity,
      soluteMolalVolume
    ) => {
      const Vta = 0.285 * soluteMolalVolume ** 1.048;
      return (
        (117.3 *
          Math.pow(10, -18) *
          Math.pow(solvent * solventMolarMass, 0.5) *
          temperature) /
        (solventViscosity * Math.pow(Vta, 0.6))
      );
    };
    const diffusivity = getDiffusivity(
      temperature,
      solvent,
      solventMolarMass,
      solventViscosity,
      soluteMolalVolume
    ).toExponential(4);

    const graph = await graphs.create({
      diffusivity: diffusivity,
      temperature: temperature,
    });

    return new Response(
      JSON.stringify({
        diffusivity,
        temperature,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        message: "An error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
