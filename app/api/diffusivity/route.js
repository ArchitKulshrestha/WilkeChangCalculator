import { connectToDB } from "@/utils/db";
import graphs from "@/utils/diffusivity";
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

    return Response.json({
      diffusivity,
      temperature,
    });
  } catch (error) {
    return Response.error(error);
  }
}

export async function GET(request) {
  try {
    await connectToDB();
    const graphData = await graphs.find();
    return Response.json({
      graphData,
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      message: "An error occurred",
    });
  }
}
export async function DELETE(request) {
  try {
    await connectToDB();
    await graphs.deleteMany();
    return Response.json({
      message: "Graph data deleted",
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      message: "An error occurred",
    });
  }
}
