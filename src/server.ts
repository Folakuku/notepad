import { Application } from "express";
import "dotenv/config";
import connectDB from "./helpers/db";
import { startGrapqlServer } from "./graphql";

const PORT = process.env.PORT;

export const startApp = async function (app: Application) {
  const httpServer = await startGrapqlServer(app);

  app.get("/", (_, res) => {
    res.status(200).json({ status: true, message: "Up and running 💪🏻" });
  });

  app.use("*", (_, res) => {
    res.status(404).json({ message: "You seem to have lost your way" });
  });

  await connectDB();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/`);
  console.log(`🚀 Graphql playground ready at http://localhost:${PORT}/graphql`);
};
