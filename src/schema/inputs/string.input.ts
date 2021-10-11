import { Field, InputType } from "type-graphql"

@InputType()
export class StringQueryOperatorInput {
  @Field(() => [String!], { nullable: true })
  in: [string]

  @Field(() => [String!], { nullable: true })
  nin: [string]

  @Field(() => String, { nullable: true })
  eq: string

  @Field(() => String, { nullable: true })
  ne: string

  @Field(() => String, { nullable: true })
  like: string
}
