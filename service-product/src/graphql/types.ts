const typeDefs = `#graphql
scalar BigInt
scalar JSON

type Product {
  id: ID!
  group_id: String!
  media_group_id: String!
  media_position: JSON!
  status: String!
  moderated: Boolean!
  seller_id: String!
  thumbnail_url: String
  name: String!
  price: Int!
  sku: String!
  model: String!
  brand: String!
  description: JSON!
  category: String!
  bullet_list: [String!]!
  color: String!
  condition_: String!
  country: String!
  origin: String!
  city: String!
  postal: String!
  discount: Boolean!
  discount_value: Int!
  discount_percent: Int!
  created_at: BigInt!
  updated_at: BigInt!
  schema_v: Int!
}

enum media_type {
  image
  video
}

input GetProductsInput {
  cursor: String
  reverseCursor: String
}

input GetProductInput {
  id: String!
}
  
type Media {
  id: ID!
  media_group_id: String!
  agent_id: String!
  product_id: String!
  mime_type: String!
  position: Int!
  alt_text: String
  resolutions: JSON!
  created_at: BigInt!
  updated_at: BigInt!
  schema_v: Int!
}

type GetProductResponse{
  product: Product!
  media: [Media]!
}

type GetProductsResponse {
  products: [Product]!
  nextCursor: String
  hasPrevMore: Boolean!
  hasNextMore: Boolean!
  totalCount: Int!
}

type Query {
  getProducts(getProductsInput: GetProductsInput!): GetProductsResponse!
  getProduct(getProductInput: GetProductInput!): GetProductResponse!
}

#/////////////////////////////////////////////////

type CreateProductResponseData {
  product_id: ID!
}

type CreateProductResponse {
  success: Boolean!
  message: String!
  data: CreateProductResponseData!
}

type EditProductResponse {
  success: Boolean!
  message: String!
}

type DeleteProductResponse {
  success: Boolean!
  message: String!
}

input CreateProductInput {
  name: String!
  price: Int!
  sku: String!
  model: String!
  brand: String!
  description: String!
  category: String!
  bullet_list: [String!]!
  color: String!
  condition_: String!
  origin: String!
  city: String!
  postal: String!
  discount: Boolean!
  discount_percent: Int!
  media_group_id: ID!
  file_ids: [ID!]!
}

input EditProductInput {
  id: ID!
  name: String!
  price: Int!
  sku: String!
  model: String!
  brand: String!
  description: JSON!
  category: String!
  bullet_list: [String!]!
  color: String!
  condition_: String!
  origin: String!
  city: String!
  postal: String!
  discount: Boolean!
  discount_percent: Int!
  media_group_id: ID!
  file_ids: [ID!]!
}

input DeleteProductInput {
  id: ID!
}

type Mutation {
  createProduct(createProductInput: CreateProductInput!): CreateProductResponse!
  editProduct(editProductInput: EditProductInput!): EditProductResponse!
  deleteProduct(deleteProductInput: DeleteProductInput!): DeleteProductResponse!
}

`;


export { typeDefs }