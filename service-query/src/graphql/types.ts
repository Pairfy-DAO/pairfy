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

type SearchProductsResponse{
  id: ID!
  thumbnail_url: String!
  name: String!
  price: Int!
  sku: String!
  model: String!
  brand: String!
  category: String!
  bullet_list: [String!]!
  color: String!
  condition_: String!
  origin: String!
  city: String!
  postal: String!
  discount: Boolean!
  discount_value: Int!
  discount_percent: Int!
}

type MediaResolutions {
  large: String!
  medium: String!
  small: String!
  thumbnail: String!
}

type Media {
  id: ID!
  media_group_id: String!
  agent_id: String!
  product_id: String!
  mime_type: String!
  position: Int!
  alt_text: String
  resolutions: MediaResolutions!
  created_at: BigInt!
  updated_at: BigInt!
  schema_v: Int!
}

type ProductSource {
  id: ID!
  name: String!
  sku: String!
  category: String!
  brand: String!
  model: String!
  price: Float!
  quality: String!
  image: String!
  keywords: String!
  rating: Float!
  reviews: Int!
  discount: Boolean!
  discount_value: Int!
  best_seller: Boolean!
}

type GetProductResponse{
  product: Product!
  media: [Media]!
}

type PriceData {
  ADA: Float
}

type PriceResponse {
  success: Boolean!
  message: String!
  data: PriceData!
}

input GetProductInput {
  id: String!
} 

input StringFilterInput {
  enabled: Boolean!
  value: String
}

input BooleanFilterInput {
  enabled: Boolean!
  value: Boolean
}

input PriceFilterInput {
  enabled: Boolean!
  value: PriceRangeInput
}

input PriceRangeInput {
  gte: Float
  lte: Float
}

input SortInput {
  price: StringFilterInput!
  rating: StringFilterInput!
  reviews: StringFilterInput!
  discount_value: StringFilterInput!
}

enum Condition {
  new
  used
  refurbished
}

input SearchProductsFiltersInput {
  sku: String
  priceMin: Int
  priceMax: Int
  category: String
  brand: String
  model: String
  condition: Condition
  discountPercentMin: Int
}

input SearchProductsInput {
  prompt: String!
  vectorized: Boolean!
  filters: SearchProductsFiltersInput!
} 

type Query {
  getFeed: String!
  getProduct(getProductInput: GetProductInput!): GetProductResponse!
  searchProducts(searchProductsInput: SearchProductsInput!): [SearchProductsResponse]!
  getPrice: PriceResponse!
}


`;

export { typeDefs };
