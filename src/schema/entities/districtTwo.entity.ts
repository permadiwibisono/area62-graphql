import { Entity, ManyToOne, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import BaseEntity from "./base"
import { DistrictOne } from "./districtOne.entity"

@ObjectType()
@Entity({ tableName: "districtTwo" })
export class DistrictTwo extends BaseEntity<DistrictTwo> {
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

  @Field(() => DistrictOne)
  @ManyToOne(() => DistrictOne, {
    onDelete: "cascade",
    fieldName: "districtOneID",
  })
  public districtOne: DistrictOne
}
