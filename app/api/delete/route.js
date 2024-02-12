import { connectToDB } from "@/utils/db";
import graphs from "@/utils/diffusivity";
export const dynamic = "force-dynamic";
export async function DELETE(request) {
  try {
    await connectToDB();
    await graphs.deleteMany();
    return new Response(
      JSON.stringify({
        message: "Graph data deleted",
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
