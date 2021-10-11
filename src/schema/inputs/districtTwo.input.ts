import { Field, InputType, Int } from "type-graphql"
import { StringQueryOperatorInput } from "./string.input"

@InputType()
export class DistrictTwoInput {
  @Field(() => Int, { nullable: true })
  id: number

  @Field(() => Int, { nullable: true })
  districtOneID: number

  @Field(() => StringQueryOperatorInput, { nullable: true })
  code: StringQueryOperatorInput

  @Field(() => StringQueryOperatorInput, { nullable: true })
  name: StringQueryOperatorInput

  @Field(() => StringQueryOperatorInput, { nullable: true })
  postal: StringQueryOperatorInput
}
