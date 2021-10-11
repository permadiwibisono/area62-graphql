import { Field, InputType, Int } from "type-graphql"
import { StringQueryOperatorInput } from "./string.input"

@InputType()
export class ProvinceInput {
  @Field(() => Int, { nullable: true })
  id: number

  @Field(() => Int, { nullable: true })
  countryID: number

  @Field(() => StringQueryOperatorInput, { nullable: true })
  code: StringQueryOperatorInput

  @Field(() => StringQueryOperatorInput, { nullable: true })
  name: StringQueryOperatorInput
}
