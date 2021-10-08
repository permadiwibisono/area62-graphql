import csv from "csv-parser"
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { request } from "../utils/stream"
import { Country } from "../schema/entities/country.entity"

interface Row {
  Name: string
  Code: string
  Latitude: string | null
  Longitude: string | null
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/countries.csv"

export const CountrySeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const results: Country[] = []
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  await connection.execute('ALTER TABLE "country" DISABLE TRIGGER ALL;')
  await connection.execute('TRUNCATE table "country" RESTART IDENTITY CASCADE;')
  await connection.execute('ALTER TABLE "country" ENABLE TRIGGER ALL;')
  return new Promise<Country[]>((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const country = em.create(Country, {
          name: data.Name,
          code: data.Code,
          lt: data.Latitude,
          ln: data.Longitude,
        })
        results.push(country)
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
        console.log("error....", err)
        await em.rollback()
        return reject(err)
      })
  })
}
