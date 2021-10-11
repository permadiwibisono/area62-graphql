/* eslint-disable no-console */
import db from "./schema/db"

// prettier-ignore
(async () => {
  try {
    const orm = await db.connect()
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
  }
})()
