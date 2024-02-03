import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";

import express, { Application, Request } from "express";
import http from "http";
import cors from "cors";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { decodeToken } from "../helpers/utlis";
import { dateScalar } from "./scalar";

interface MyContext {
  token?: string;
}

export const startGrapqlServer = async (app: Application) => {
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers: { Date: dateScalar, ...resolvers },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return await authHandler(req);
      },
    })
  );
  return httpServer;
};

const authHandler = async (req: Request) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ") ||
    !req.headers.authorization.split(" ")[1] ||
    !req.headers.authorization.split(" ")[1].length
  ) {
    return {};
  }

  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    let user = await decodeToken(token);

    return { user };
  }
  return {};
};
