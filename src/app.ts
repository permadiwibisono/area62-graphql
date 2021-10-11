import "express-async-errors"
import express from "express"
import createError, { HttpError } from "http-errors"
import { Server } from "http"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import { graphqlHTTP } from "express-graphql"
import playground from "graphql-playground-middleware-express"
import { GraphQLError, GraphQLSchema } from "graphql"
import { buildSchema } from "type-graphql"
import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core"
import {
  CityResolver,
  CountryResolver,
  DistrictOneResolver,
  DistrictTwoResolver,
  HomeResolver,
  PostalCodeResolver,
  ProvinceResolver,
} from "./schema/resolvers"
import db from "./schema/db"
import { GraphQLContext } from "./types"
import { loggerMiddleware as httpLogger } from "./middlewares/logger.middleware"
import { logger } from "./utils"
import { appConfig } from "./config"

export default class App {
  public host = express()

  public server: Server

  public orm: MikroORM<IDatabaseDriver<Connection>>

  public init = async (): Promise<void> => {
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
      this.host.use(httpLogger)
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
        resolvers: [
          HomeResolver,
          CountryResolver,
          ProvinceResolver,
          CityResolver,
          DistrictOneResolver,
          DistrictTwoResolver,
          PostalCodeResolver,
        ],
        dateScalarMode: "isoDate",
        validate: false,
      })

      this.host.post(
        "/graphql",
        express.json(),
        graphqlHTTP((req, res) => ({
          schema,
          context: { req, res, em: this.orm.em.fork() } as GraphQLContext,
          customFormatErrorFn: (error) => {
            throw error
          },
        }))
      )

      this.host.use(
        (
          _: express.Request,
          _0: express.Response,
          next: express.NextFunction
        ) => {
          next(createError(404, "Resource not found"))
        }
      )

      this.host.use(
        (
          error: HttpError,
          _: express.Request,
          res: express.Response,
          next: express.NextFunction
        ): void => {
          if (res.headersSent) {
            next(error)
          } else {
            logger.error(error, "📌 Something went wrong")
            if (error instanceof GraphQLError) {
              res.status(400).json(error)
            } else {
              const result: {
                message: string
                statusCode: number
                stack?: string
              } = {
                message: error.message || "Internal server error",
                statusCode: error.status || 500,
              }
              if (appConfig.stage === "local") {
                result.stack = error.stack
              }
              res.status(result.statusCode).json({ error: result })
            }
          }
        }
      )
    } catch (error) {
      logger.error(error, "Error was occurred")
      throw error
    }
  }

  public connect = async () => {
    this.orm = await db.connect()
    logger.info("DB was established succesfully")
  }
}
