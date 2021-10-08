import { Entity, ManyToOne, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import BaseEntity from "./base"
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
}
