import csv from "csv-parser"
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { request } from "../utils"
import { Province } from "../schema/entities/province.entity"
import { Country } from "../schema/entities/country.entity"

interface Row {
  Name: string
  Parent: string
  Code: string
  Latitude: string | null
  Longitude: string | null
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/provinces.csv"

export const ProvinceSeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const results: Province[] = []
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  const countries = await em.find(Country, {})
  await connection.execute('ALTER TABLE "province" DISABLE TRIGGER ALL;')
  await connection.execute(
    'TRUNCATE table "province" RESTART IDENTITY CASCADE;'
  )
  await connection.execute('ALTER TABLE "province" ENABLE TRIGGER ALL;')
  return new Promise<Province[]>((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const country = countries.find((i) => i.phoneCode === data.Parent)
        if (country) {
          const province = em.create(Province, {
            country,
            name: data.Name,
            code: data.Code,
            lt: data.Latitude || undefined,
            ln: data.Longitude || undefined,
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
