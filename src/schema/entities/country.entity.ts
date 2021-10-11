import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import BaseEntity from "./base"
import { Province } from "./province.entity"

@ObjectType()
@Entity({ tableName: "country" })
export class Country extends BaseEntity<Country> {
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

  @Field(() => [Province!])
  @OneToMany(() => Province, (province: Province) => province.country, {
    cascade: [Cascade.ALL],
    fieldName: "countryID",
  })
  public provinces = new Collection<Province>(this)
}
