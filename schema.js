const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    joinDate: String!
    reservations: [Reservation!]!
  }

  type Reservation {
    id: ID!
    name: String!
    hotelName: String!
    arrivalDate: String!
    departureDate: String!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type Query {
    getCurrentUser: User
    reservations: [Reservation!]!
    reservation(id: ID!): Reservation
  }

  type Token {
    token: String!
  }

  type Mutation {
    signInUser(username: String!, password: String): Token
    signUpUser(username: String!, password: String!, password: String!): Token
    createReservation(name: String!, hotelName: String!, arrivalDate: String!, departureDate: String!, userId: ID!): Reservation
    updateReservation(id: ID!, name: String!, hotelName: String!, arrivalDate: String!, departureDate: String!): [Int!]!
    deleteReservation(id: ID!): Int!
  }
`

export default typeDefs;