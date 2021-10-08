import csv from "csv-parser"
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { request } from "../utils/stream"
import { Country } from "../schema/entities/country.entity"
import { Province } from "../schema/entities/province.entity"

interface Row {
  Name: string
  Parent: string
  Code: string
  Latitude: string | null
  Longitude: string | null
}

export const ProvinceSeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>,
  countries: Country[]
) => {
  const results: Province[] = []
  const url =
    "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/provinces.csv"
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  await connection.execute('ALTER TABLE "province" DISABLE TRIGGER ALL;')
  await connection.execute(
    'TRUNCATE table "province" RESTART IDENTITY CASCADE;'
  )
  await connection.execute('ALTER TABLE "province" ENABLE TRIGGER ALL;')
  return new Promise((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const country = countries.find((i) => i.code === data.Parent)
        if (country) {
          const province = em.create(Province, {
            country,
            name: data.Name,
            code: data.Code,
            lt: data.Latitude,
            ln: data.Longitude,
          })
          results.push(province)
        }
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
