import csv from "csv-parser"
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { request } from "../utils/stream"
import { PostalCode } from "../schema/entities/postalCode.entity"

interface Row {
  Name: string
  Code: string
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/postalCodes.csv"

export const PostalCodeSeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const results: PostalCode[] = []
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  await connection.execute('TRUNCATE table "postalCode" RESTART IDENTITY;')
  return new Promise((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const postal = em.create(PostalCode, {
          name: data.Name,
          code: data.Code,
        })
        results.push(postal)
      })
      .on("end", async () => {
        await em.persistAndFlush(results)
        await em.commit()
        return resolve(results)
      })
      .on("close", async () => {
        res.data.destroy()
      })
      .on("error", async (err: any) => {
        await em.rollback()
        return reject(err)
      })
  })
}
