const typeDefs = `#graphql
scalar JSON
scalar BigInt

type Message {
    id: ID!
    sender: String!
    role: String!
    message: String!
    seen: Boolean!
    created_at: BigInt!
}

type GetMessagesData {
    messages: [Message!]
    seen: [String]
}

type GetMessagesResponse {
  success: Boolean!
  message: String!
  data: GetMessagesData!
}

input GetMessagesInput {
  session: String!
} 

type Query {
  getMessages(getMessagesInput: GetMessagesInput!): GetMessagesResponse!
}

#--------------------------------------------------------------------------- MUTATIONS

type CreateMessageResponse {
  success: Boolean!
  message:  String!
}

type UpdateMessageResponse {
  success: Boolean!
   message:  String!
}

input UpdateMessageInput {
  message_id: String!
} 

input CreateMessageInput {
  session: String!
  content: String!
} 

type Mutation {
  createMessage(createMessageInput: CreateMessageInput!): CreateMessageResponse!
  updateMessage(updateMessageInput: UpdateMessageInput!): UpdateMessageResponse!
}

`;

export { typeDefs };
