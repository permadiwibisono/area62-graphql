import csv from "csv-parser"
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { DistrictOne } from "../schema/entities/districtOne.entity"
import { City } from "../schema/entities/city.entity"
import { request } from "../utils/stream"

interface Row {
  Name: string
  Parent: string
  Code: string
  Postal: string | null
  Latitude: string | null
  Longitude: string | null
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/subDistricts.csv"

export const DistrictOneSeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const results: DistrictOne[] = []
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  const cities = await em.find(City, {})
  await connection.execute('ALTER TABLE "districtOne" DISABLE TRIGGER ALL;')
  await connection.execute(
    'TRUNCATE table "districtOne" RESTART IDENTITY CASCADE;'
  )
  await connection.execute('ALTER TABLE "districtOne" ENABLE TRIGGER ALL;')
  return new Promise<DistrictOne[]>((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const city = cities.find((i) => i.code === data.Parent)
        if (city) {
          const districtOne = em.create(DistrictOne, {
            city,
            name: data.Name,
            code: data.Code,
            postal: data.Postal,
            lt: data.Latitude,
            ln: data.Longitude,
          })
          results.push(districtOne)
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
