import database from "../../database/client.js";
import {
  ApiGraphQLError,
  createEvent,
  ERROR_CODES,
  findProductById,
  findProductBySeller,
  findProductBySku,
  sanitizeArrayGraphQL,
  sanitizeTiptapContent,
  SellerToken,
  updateProduct,
} from "@pairfy/common";
import { verifyParams } from "../../validators/edit-product.js";
import { checkFileGroup } from "../../utils/media.js";
import { applyDiscount } from "../../utils/index.js";

export const editProduct = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    args.editProductInput.bullet_list = sanitizeArrayGraphQL(
      args.editProductInput.bullet_list
    );

    const validateParams = verifyParams.safeParse(args.editProductInput);

    if (!validateParams.success) {
      const errors = JSON.stringify(validateParams.error.flatten());
      throw new ApiGraphQLError(400, `Validation failed: ${errors}`, {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    args.editProductInput.description = sanitizeTiptapContent(
      args.editProductInput.description
    );

    /////////////////////////////////////////////////////////////////////////////////////

    connection = await database.client.getConnection();

    const params = validateParams.data;

    const SELLER = context.sellerData as SellerToken;

    const timestamp = Date.now();

    /////////////////////////////////////////////////////////////////////////////////////

    const findProduct = await findProductBySeller(
      connection,
      params.id,
      SELLER.id
    );

    if (!findProduct) {
      throw new ApiGraphQLError(404, "The product does not exist", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (findProduct.media_group_id !== params.media_group_id) {
      throw new ApiGraphQLError(400, "Invalid MediaGroupId", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    if (findProduct.sku !== params.sku) {
      const isSkuRepeated = await findProductBySku(
        connection,
        SELLER.id,
        params.sku
      );

      if (isSkuRepeated) {
        throw new ApiGraphQLError(409, "Repeated Product Sku", {
          code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        });
      }
    }

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////////////////////////////////// START TRANSACTION

    const isValidGroup = await checkFileGroup(
      "http://service-media.default.svc.cluster.local:8003/api/media/verify-group",
      {
        agent_id: SELLER.id,
        media_group_id: params.media_group_id,
        file_ids: params.file_ids,
        product_id: params.id,
      },
      process.env.INTERNAL_ENDPOINT_SECRET as string
    );

    if (!isValidGroup) {
      throw new ApiGraphQLError(409, "Inconsistency of image ids.", {
        code: ERROR_CODES.CONFLICT,
      });
    }

    const updateScheme: any = {
      media_position: params.file_ids,
      thumbnail_url: isValidGroup.thumbnail_url,
      name: params.name,
      price: params.price,
      sku: params.sku,
      model: params.model,
      brand: params.brand,
      description: params.description,
      category: params.category,
      bullet_list: params.bullet_list,
      color: params.color,
      condition_: params.condition_,
      origin: params.origin,
      city: params.city,
      postal: params.postal,
      discount: params.discount,
      discount_value: applyDiscount(params.price, params.discount_percent),
      discount_percent: params.discount_percent,
      updated_at: timestamp,
      schema_v: findProduct.schema_v + 1,
    };

    console.log(updateScheme);

    const update = await updateProduct(
      connection,
      findProduct.id,
      findProduct.schema_v,
      updateScheme
    );

    if (update.affectedRows !== 1) {
      throw new ApiGraphQLError(
        409,
        "Update failed: version mismatch or not found",
        {
          code: ERROR_CODES.UPDATE_CONFLICT,
        }
      );
    }

    const updatedProduct = await findProductById(connection, findProduct.id);

    await createEvent(
      connection,
      timestamp,
      "service-product",
      "UpdateProduct",
      JSON.stringify(updatedProduct),
      SELLER.id
    );

    ///////////////////////////////////////////////////////////////////////////////////// END TRANSACTION

    await connection.commit();

    return { success: true, message: "The product was updated successfully!" };
  } catch (error: any) {
    if (connection) await connection.rollback();

    throw error;
  } finally {
    if (connection) connection.release();
  }
};
