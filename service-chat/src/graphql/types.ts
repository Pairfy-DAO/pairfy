const typeDefs = `#graphql

type Message {
    id: ID!
    agent: String!
    role: String!
    content: String!
    seen: Boolean!
    created_at: Float!
}

type GetMessagesResponse {
  messages: [Message!]
  seen: String!
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

#--------------------------------------------------------------------------- SUBSCRIPTIONS
 
type Subscription {
    newMessages(session: ID!): Message!
}


`;

export { typeDefs };
