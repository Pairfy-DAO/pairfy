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

type GetNotificationResponse {
  unseen: [Notification!]
  seen: [Notification!]
}

type GetCursorResponse {
  notifications: [Notification!]
  nextCursor: String
  hasPrevMore: Boolean!
  hasNextMore: Boolean!
  totalCount: Int!
}

input GetCursorInput {
  cursor: String
  reverseCursor: String
}  

type Query {
  getNotifications: GetNotificationResponse!
  getCursor(getCursorInput: GetCursorInput!): GetCursorResponse!
}

#----------------------------------------------------------------MUTATIONS

type EditNotificationsResponse {
  success: Boolean!
  message: String!
}

input EditNotificationsInput {
  ids: [String!]
} 

type Mutation {
  editNotifications(editNotificationsInput: EditNotificationsInput!): EditNotificationsResponse!
}

`;

export { typeDefs };
