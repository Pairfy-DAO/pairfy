import { gql } from 'graphql-tag'

const EDIT_PRODUCT_MUTATION = gql`
  mutation($editProductVariable: EditProductInput!) {
    editProduct(editProductInput: $editProductVariable) {
      success
      message
    }
  }
`
