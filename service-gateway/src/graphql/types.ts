const typeDefs = `#graphql
scalar BigInt

type Product {
    id: String!
    state: String!
    state_label: String!
    moderated: Int!
    seller_id: String!
    name: String!
    price: Int!
    sku: String!
    model: String!
    brand: String!
    features: String!
    category: String!
    keywords: String!
    bullet_list: String!
    paused: Int!
    color: String!
    color_name: String!
    quality: String!
    country: String!
    media_url: String!
    image_path: String!
    video_path: String!
    image_set: String!
    video_set: String!
    discount: Boolean!
    discount_value: Int!
    created_at: String!
}

type Book {
  id: ID!
  seller_id: String!
  keeping_stock: Int!
  ready_stock: Int!
  blocked_stock: Int!
  purchase_limit: Boolean!
  purchase_limit_value: Int
  stop_purchases: Boolean!
  sold_count: Int!
  created_at: BigInt!
  updated_at: BigInt!
  schema_v: Int!
  product_name: String!
  product_sku: String!
  thumbnail_url: String!
}

type GetBooksResponse {
  books: [Book]!
  nextCursor: String
  hasPrevMore: Boolean!
  hasNextMore: Boolean!
  totalCount: Int!
}

type Order {
  id: ID!
  type: String!
  status: String!
  finished: Boolean!
  completed: Boolean!

  country: String!
  
  buyer_pubkeyhash: String!
  buyer_address: String!
  buyer_wallet: String!
  buyer_username: String!

  seller_id: ID!
  seller_pubkeyhash: String!
  seller_address: String!
  seller_wallet: String!
  seller_username: String!
  rsa_version: Int!

  product_id: ID!
  product_snapshot: String!
  contract_address: String!
  contract_params: String!
  contract_state: Int
  contract_price: Int!
  contract_quote: Int!
  contract_fee: Int!
  contract_units: Int!
  asset_name: String!
  asset_price: Float!

  watch_until: BigInt!
  pending_until: BigInt!
  shipping_until: BigInt!
  expire_until: BigInt!

  pending_tx: String
  pending_block: String
  pending_metadata: String

  returned_tx: String
  returned_block: String
  returned_metadata: String

  locking_tx: String
  locking_block: String
  locking_metadata: String

  canceled_tx: String
  canceled_block: String
  canceled_metadata: String

  shipping_tx: String
  shipping_block: String
  shipping_metadata: String

  appealed_tx: String
  appealed_block: String
  appealed_metadata: String

  received_tx: String
  received_block: String
  received_metadata: String

  collected_tx: String
  collected_block: String
  collected_metadata: String

  scanned_at: BigInt
  created_at: BigInt!
  updated_at: BigInt!
  schema_v: Int!
}

type getOrderResponse {
  order: Order!
  product: String!
  shipping: String
  address: String
  session: String!
}

input GetBooksInput {
  cursor: String
  reverseCursor: String
}  

input GetOrdersInput {
  id: String!
} 

input GetOrderInput {
  id: ID!
} 

type Query {
  getOrder(getOrderInput: GetOrderInput!): getOrderResponse!
  getBooks(getBooksInput: GetBooksInput!): GetBooksResponse!
}

#----------------------------------------------------------------- MUTATIONS

type EditBookResponse {
  success: Boolean!
  message: String!
}

type CborPayload {
  cbor: String!
}

type PendingEndpointPayload {
  cbor: String!
  order: String!
  spk: String!
}

type PendingEndpointResponse {
  success: Boolean!
  message: String!
  data: PendingEndpointPayload!
}

type CancelEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type ReturnEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type LockingEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type ShippingEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type AppealEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type ReceivedEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type CollectEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

input EditBookInput {
  id: ID!
  keeping_stock: Int!
  ready_stock: Int!
  purchase_limit: Boolean!
  purchase_limit_value: Int!
  stop_purchases: Boolean!
} 

input PendingEndpointInput {
  product_id: ID!
  order_units: Int!
  asset: String!
} 

input CancelEndpointInput {
  order_id: String!
} 

input ReturnEndpointInput {
  order_id: String!
} 

input LockingEndpointInput {
  order_id: String!
} 

input ShippingEndpointInput {
  order_id: String!
  guide: String!
  date: String!
  website: String!
  notes: String!
} 

input AppealEndpointInput {
  order_id: String!
} 

input ReceivedEndpointInput {
  order_id: String!
} 

input CollectEndpointInput {
  order_id: String!
} 

type Mutation {
  editBook(editBookInput: EditBookInput!): EditBookResponse!
  pendingEndpoint(pendingEndpointInput: PendingEndpointInput!): PendingEndpointResponse!
  cancelEndpoint(cancelEndpointInput: CancelEndpointInput!): CancelEndpointResponse!
  returnEndpoint(returnEndpointInput: ReturnEndpointInput!): ReturnEndpointResponse!
  lockingEndpoint(lockingEndpointInput: LockingEndpointInput!): LockingEndpointResponse!
  shippingEndpoint(shippingEndpointInput: ShippingEndpointInput!): ShippingEndpointResponse!
  appealEndpoint(appealEndpointInput: AppealEndpointInput!): AppealEndpointResponse!
  receivedEndpoint(receivedEndpointInput: ReceivedEndpointInput!): ReceivedEndpointResponse!
  collectEndpoint(collectEndpointInput: CollectEndpointInput!): CollectEndpointResponse!
}

`;

export { typeDefs };
