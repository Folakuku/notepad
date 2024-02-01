export const typeDefs = `#graphql
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String
  }

  type Note{
    _id:ID!
    user:User!
    title:String!
    content:String!
    createdAt: Date
    updatedAt: Date
  }

  type AuthPayload {
    token: String!
    user: User!
}

  type Query {
    currentUser: User!
    myNotes(
      startDate: Date
      endDate: Date
      titleFilter: String
    ): [Note]
  }

  type Mutation {
    createUser(
      username: String!
      email:    String!
      password: String!
    ): AuthPayload!

    login(
      email:    String!
      password: String!
    ): AuthPayload!

    addNote(
      title:     String!
      content:     String!
    ): Note!

    editNote(
      _id:       String!
      title:     String!
      content:     String!
    ): Note!

    deleteNote(_id: ID!): Boolean!
  }
`;
