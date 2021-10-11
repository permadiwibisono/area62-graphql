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
import { DistrictOne } from "./districtOne.entity"
import { Province } from "./province.entity"

@ObjectType()
@Entity({ tableName: "city" })
export class City extends BaseEntity<City> {
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

  @Field(() => Province)
  @ManyToOne(() => Province, { onDelete: "cascade", fieldName: "provinceID" })
  public province: Province

  @Field(() => [DistrictOne!])
  @OneToMany(
    () => DistrictOne,
    (districtOne: DistrictOne) => districtOne.city,
    {
      cascade: [Cascade.ALL],
      fieldName: "cityID",
    }
  )
  public districtOnes = new Collection<DistrictOne>(this)
}
