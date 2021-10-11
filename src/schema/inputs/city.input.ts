import { Field, InputType, Int } from "type-graphql"
import { StringQueryOperatorInput } from "./string.input"

@InputType()
export class CityInput {
  @Field(() => Int, { nullable: true })
  id: number

  @Field(() => Int, { nullable: true })
  provinceID: number

  @Field(() => StringQueryOperatorInput, { nullable: true })
  code: StringQueryOperatorInput

  @Field(() => StringQueryOperatorInput, { nullable: true })
  name: StringQueryOperatorInput

  @Field(() => StringQueryOperatorInput, { nullable: true })
  postal: StringQueryOperatorInput
}
