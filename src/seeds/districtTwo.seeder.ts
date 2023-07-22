import csv from "csv-parser"
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { DistrictOne } from "../schema/entities/districtOne.entity"
import { request } from "../utils"
import { DistrictTwo } from "../schema/entities/districtTwo.entity"

interface Row {
  Name: string
  Parent: string
  Code: string
  Postal: string | null
  Latitude: string | null
  Longitude: string | null
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/villages.csv"

export const DistrictTwoSeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const results: DistrictTwo[] = []
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  const districts = await em.find(DistrictOne, {})
  await connection.execute('ALTER TABLE "districtTwo" DISABLE TRIGGER ALL;')
  await connection.execute(
    'TRUNCATE table "districtTwo" RESTART IDENTITY CASCADE;'
  )
  await connection.execute('ALTER TABLE "districtTwo" ENABLE TRIGGER ALL;')
  return new Promise<DistrictTwo[]>((resolve, reject) => {
    res.data
      .pipe(csv())
      .on("data", (data: Row) => {
        const districtOne = districts.find((i) => i.code === data.Parent)
        if (districtOne) {
          const districtTwo = em.create(DistrictTwo, {
            districtOne,
            name: data.Name,
            code: data.Code,
            postal: data.Postal || undefined,
            lt: data.Latitude || undefined,
            ln: data.Longitude || undefined,
          })
          results.push(districtTwo)
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
