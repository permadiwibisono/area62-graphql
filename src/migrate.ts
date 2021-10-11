/* eslint-disable no-console */
import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core"
import db from "./schema/db"

type ORM = MikroORM<IDatabaseDriver<Connection>> | null

// prettier-ignore
(async () => {
  let orm: ORM = null
  try {
    orm = await db.connect()
    const migrator = orm.getMigrator()
    const getPending = await migrator.getPendingMigrations()
    if (getPending.length) {
      await migrator.up()
      console.log("Migration up successfully")
    } else {
      console.log("No pending migration")
    }
  } catch (error) {
    console.log("error boot app: ", error)
  } finally {
    if (orm) orm.close()
  }
})()
