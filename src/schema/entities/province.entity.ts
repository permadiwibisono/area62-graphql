import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import BaseEntity from "./base"
import { City } from "./city.entity"
import { Country } from "./country.entity"

@ObjectType()
@Entity({ tableName: "province" })
export class Province extends BaseEntity<Province> {
  @Field()
  @Property()
  code!: string

  @Field()
  @Property()
  name!: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  lt?: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  ln?: string

  @Field(() => Country)
  @ManyToOne(() => Country, { onDelete: "cascade", fieldName: "countryID" })
  public country: Country

  @Field(() => [City!])
  @OneToMany(() => City, (city: City) => city.province, {
    cascade: [Cascade.ALL],
    fieldName: "provinceID",
  })
  public cities = new Collection<City>(this)
}
