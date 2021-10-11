import { BaseEntity, PrimaryKey, Property, wrap } from "@mikro-orm/core"
import { ObjectType, Field, Int } from "type-graphql"

@ObjectType({ isAbstract: true })
export default class Base<T extends { id: number }> extends BaseEntity<
  T,
  "id"
> {
  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field(() => Date)
  @Property({ type: Date })
  createdAt = new Date()

  @Field(() => Date)
  @Property({ type: Date, onUpdate: () => new Date() })
  updatedAt = new Date()

  public toJson() {
    return wrap(this).toJSON()
  }

  public toObj(ignoredFields?: string[]) {
    return wrap(this).toObject(ignoredFields)
  }
}
