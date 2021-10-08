import { Entity, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import BaseEntity from "./base"

@ObjectType()
@Entity({ tableName: "postalCode" })
export class PostalCode extends BaseEntity<PostalCode> {
  @Field()
  @Property()
  code!: string

  @Field()
  @Property()
  name!: string
}
