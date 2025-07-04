const typeDefs = `#graphql

scalar BigInt

type Notification {
  id: ID!
  type: String!
  title: String!
  owner: String!
  seen: Boolean!
  data: String!
  message: String!
  created_at: BigInt!
  updated_at: BigInt!
}

type Query {
  getNotifications: [Notification!]
}

#----------------------------------------------------------------MUTATIONS

type EditNotificationsResponse {
  success: Boolean!
  message: String!
}

input EditNotificationsInput {
  ids: String!
} 

type Mutation {
  editNotifications(editNotificationsInput: EditNotificationsInput!): EditNotificationsResponse!
}

`;

export { typeDefs };
