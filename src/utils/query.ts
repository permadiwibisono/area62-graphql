import { FilterQuery } from "@mikro-orm/core"

export function parseOperators(operators: any) {
  return Object.entries(operators).reduce(
    (acc, [operator, value]) => ({
      ...acc,
      [`$${operator}`]: value,
    }),
    {}
  )
}

export function parseFilterInput<T>(filter = {}): FilterQuery<T> {
  return Object.entries(filter).reduce(
    (acc, [key, operators]) => ({
      ...acc,
      [key]:
        typeof operators === "object" ? parseOperators(operators) : operators,
    }),
    {}
  )
}
