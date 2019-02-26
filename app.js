import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import db from "./models";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";

config({ path: ".env" });

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  context: { db }
});

const app = express();

server.applyMiddleware({ app });

app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== null) {
    try {
      const currentUser = await verify(token, process.env.SECRET)
      req.currentUser = currentUser;
      console.log("current user on fetch", req.currentUser);
    } catch (err) {
      console.log(err);
    }
  }
  next();
});

export default app;