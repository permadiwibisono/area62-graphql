import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { Field, Int, ObjectType } from "type-graphql"

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
export default abstract class Base<T extends { id: number }> extends BaseEntity<
  T,
  "id"
> {
  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field()
  @Property()
  createdAt?: Date = new Date()

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date()
}
