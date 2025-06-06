import { gql } from "graphql-tag";


const GET_PRODUCT_QUERY = gql`
  query GetProduct($getProductVariable: GetProductInput!) {
    getProduct(getProductInput: $getProductVariable) {
        product {
          id
          group_id
          media_group_id
          media_position
          status
          moderated
          thumbnail_url
          name
          price
          sku
          model
          brand
          description
          category
          bullet_list
          color
          condition_
          country
          origin
          city
          postal
          discount
          discount_value
          discount_percent
          created_at
        }

        media {
          id  
          media_group_id  
          product_id  
          mime_type  
          position  
          alt_text  
          resolutions  
          created_at  
          updated_at  
        }
          
    }
  }
`;