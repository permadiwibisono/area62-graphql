import { MikroORM } from "@mikro-orm/core"
import path from "path"
import { dbConfig } from "./config/db"

export default {
  migrations: {
    tableName: "migration", // name of database table with log of executed transactions
    path: path.join(__dirname, "./schema/migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: ["dist/schema/entities/*.entity.js"],
  entitiesTs: ["src/schema/entities/*.entity.ts"],
  dbName: dbConfig.dbName,
  type: dbConfig.dialect,
  user: dbConfig.user,
  port: dbConfig.port,
  password: dbConfig.password,
  debug: dbConfig.debug,
} as Parameters<typeof MikroORM.init>[0]
