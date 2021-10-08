import { Entity, ManyToOne, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import BaseEntity from "./base"
import { City } from "./city.entity"

@ObjectType()
@Entity({ tableName: "districtOne" })
export class DistrictOne extends BaseEntity<DistrictOne> {
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

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  postal?: string

  @Field(() => City)
  @ManyToOne(() => City, { onDelete: "cascade", fieldName: "cityID" })
  public city: City
}
