import csv from "csv-parser"
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { City } from "../schema/entities/city.entity"
import { request } from "../utils"
import { Province } from "../schema/entities/province.entity"

interface Row {
  Name: string
  Parent: string
  Code: string
  Postal: string | null
  Latitude: string | null
  Longitude: string | null
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/cities.csv"

export const CitySeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const results: City[] = []
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  const provinces = await em.find(Province, {})
  await connection.execute('ALTER TABLE "city" DISABLE TRIGGER ALL;')
  await connection.execute('TRUNCATE table "city" RESTART IDENTITY CASCADE;')
  await connection.execute('ALTER TABLE "city" ENABLE TRIGGER ALL;')
  return new Promise<City[]>((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const province = provinces.find((i) => i.code === data.Parent)
        if (province) {
          const city = em.create(City, {
            province,
            name: data.Name,
            code: data.Code,
            postal: data.Postal,
            lt: data.Latitude,
            ln: data.Longitude,
          })
          results.push(city)
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
