import { Type, type Static } from '@sinclair/typebox'

export const Person = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  male: Type.Boolean()
})

export const Response = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  male: Type.Boolean()
})

export type PersonType = Static<typeof Person>
export type ResponseType = Static<typeof Response>
