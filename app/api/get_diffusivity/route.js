import { connectToDB } from "@/utils/db";
import graphs from "@/utils/diffusivity";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();
    const graphdata = await graphs.find();
    const graphData = graphdata.map((item) => ({
      diffusivity: item.diffusivity,
      temperature: item.temperature,
    }));

    return new Response(JSON.stringify({ graphData }), { status: 200 });
  } catch (err) {
    console.error("Error in GET request:", err); // Log the error
    return new Response(
      JSON.stringify({
        message: "An error occurred",
        error: err.message, // Include the error message in the response
      }),
      { status: 500 }
    );
  }
}
