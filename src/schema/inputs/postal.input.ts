import { Field, InputType, Int } from "type-graphql"
import { StringQueryOperatorInput } from "./string.input"

@InputType()
export class PostalInput {
  @Field(() => Int, { nullable: true })
  id: number

  @Field(() => StringQueryOperatorInput, { nullable: true })
  code: StringQueryOperatorInput

  @Field(() => StringQueryOperatorInput, { nullable: true })
  name: StringQueryOperatorInput
}
