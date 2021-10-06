import express from "express"
import { Server } from "http"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import morgan from "morgan"
import { graphqlHTTP } from "express-graphql"
import playground from "graphql-playground-middleware-express"
import { GraphQLSchema } from "graphql"
import { buildSchema } from "type-graphql"
import { HomeResolver } from "./schema/resolvers"

export default class App {
  public host: express.Application

  public server: Server

  public init = async (): Promise<void> => {
    this.host = express()
    try {
      this.host.enable("trust proxy")
      this.host.use(compression())
      this.host.use(express.json())
      this.host.use(express.urlencoded({ extended: true }))
      this.host.use(cors())
      this.host.use(
        helmet({
          contentSecurityPolicy: false,
        })
      )
      this.host.use(hpp())
      this.host.use(
        morgan(
          "[:date[iso]] :method :url :status :res[content-length] - :response-time ms"
        )
      )
      if (this.host.get("env") === "production") {
        const limiter = rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 100,
        })
        //  apply to all requests
        this.host.use(limiter)
      }
      if (this.host.get("env") !== "production") {
        this.host.get("/graphql", playground({ endpoint: "/graphql" }))
      }
      const schema: GraphQLSchema = await buildSchema({
        resolvers: [HomeResolver],
        dateScalarMode: "isoDate",
        validate: false,
      })
      this.host.post(
        "/graphql",
        graphqlHTTP(() => ({
          schema,
          customFormatErrorFn: (error) => {
            throw error
          },
        }))
      )
    } catch (error) {
      console.log("Error was occurred", error)
      throw error
    }
  }
}
