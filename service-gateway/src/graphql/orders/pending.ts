import database from "../../database/client.js";
import { pendingTransactionBuilder } from "../../cardano/builders/pending.js";
import { chunkMetadata, encryptMetadata } from "../../lib/metadata.js";
import { getContractFee, getContractPrice } from "../../lib/index.js";
import { pendingEndpointSchema } from "../../validators/orders.js";
import { UserToken } from "@pairfy/common";
import { redisClient } from "../../database/redis.js";
import { GraphQLError } from "graphql";

const pendingEndpoint = async (_: any, args: any, context: any) => {
  if (!context.userData) {
    throw new GraphQLError("pendingEndpointCredentials", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: {
          status: 401,
        },
        message: "userData",
      },
    });
  }

  const USER = context.userData as UserToken;

  console.log(args.pendingEndpointInput);

  const validateParams = pendingEndpointSchema.safeParse(
    args.pendingEndpointInput
  );

  if (!validateParams.success) {
    throw new GraphQLError("pendingEndpointParams", {
      extensions: {
        code: "BAD_USER_INPUT",
        message: validateParams.error.flatten(),
        http: {
          status: 400,
        },
      },
    });
  }

  const params = validateParams.data;

  if (params.product_units <= 0) {
    throw new GraphQLError("pendingEndpointParams", {
      extensions: {
        code: "BAD_USER_INPUT",
        http: {
          status: 400,
        },
        message: "product_units",
      },
    });
  }

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [products] = await connection.execute(
      `SELECT
             p.id AS product_id,
             p.name AS product_name,
             p.price AS product_price,
             p.sku AS product_sku,
             p.model AS product_model,
             p.brand AS product_brand,
             p.features AS product_features,
             p.bullet_list AS product_bullet_list,
             p.country AS product_country,
             p.discount AS product_discount,
             p.discount_value AS product_discount_value,
             p.media_url AS product_media_url,
             p.image_path AS product_image_path,
             p.video_path AS product_video_path,
             p.image_set AS product_image_set,
             p.video_set AS product_video_set,
             s.id AS seller_id,
             s.pubkeyhash AS seller_pubkeyhash,
             s.address AS seller_address
         FROM
             products p
         INNER JOIN
             sellers s
         ON
             p.seller_id = s.id            
         WHERE
             p.id = ?`,
      [params.product_id]
    );

    if (!products.length) {
      throw new GraphQLError("pendingEndpointDatabase", {
        extensions: {
          code: "NOT_FOUND",
          http: {
            status: 404,
          },
          message: "Product Id",
        },
      });
    }

    const QUERY = products[0];

    if (!QUERY.seller_pubkeyhash) {
      throw new GraphQLError("pendingEndpointDatabase", {
        extensions: {
          code: "NOT_FOUND",
          http: {
            status: 404,
          },
          message: "Seller PubKeyHash",
        },
      });
    }

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const PGPVersion = "1.0";

    const externalData = {
      data: params.data,
      version: PGPVersion,
    };

    const encrypted = await encryptMetadata(
      JSON.stringify(externalData),
      PGPVersion
    );

    const metadata = {
      version: PGPVersion,
      msg: chunkMetadata(encrypted, 64),
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const getADAPrice = await redisClient.client.get("price:ADAUSDT");

    if (!getADAPrice) {
      throw new Error("ADA_PRICE");
    }

    const ADAUSD = parseFloat(getADAPrice);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const contractPrice: number = await getContractPrice(
      QUERY.product_discount,
      QUERY.product_discount_value,
      QUERY.product_price,
      params.product_units,
      ADAUSD
    );

    const contractFee: number = await getContractFee(contractPrice);

    const operator = "a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141";

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const BUILDER = await pendingTransactionBuilder(
      operator,
      USER.address,
      QUERY.seller_pubkeyhash,
      BigInt(contractPrice),
      BigInt(contractFee),
      metadata
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const orderData = {
      id: BUILDER.threadTokenPolicyId,
      country: QUERY.product_country,
      seller_id: QUERY.seller_id,
      buyer_pubkeyhash: USER.pubkeyhash,
      seller_pubkeyhash: QUERY.seller_pubkeyhash,
      buyer_address: USER.address,
      seller_address: QUERY.seller_address,
      buyer_username: USER.username,
      ada_price: ADAUSD,
      contract_address: BUILDER.stateMachineAddress,
      contract_params: BUILDER.serializedParams,
      contract_price: contractPrice,
      contract_fee: contractFee,
      contract_units: params.product_units,
      product_id: QUERY.product_id,
      product_name: QUERY.product_name,
      product_price: QUERY.product_price,
      product_sku: QUERY.product_sku,
      product_model: QUERY.product_model,
      product_brand: QUERY.product_brand,
      product_features: QUERY.product_features,
      product_bullet_list: QUERY.product_bullet_list,
      product_discount: QUERY.product_discount,
      product_discount_value: QUERY.product_discount_value,
      product_media_url: QUERY.product_media_url,
      product_image_path: QUERY.product_image_path,
      product_video_path: QUERY.product_video_path,
      product_image_set: QUERY.product_image_set,
      product_video_set: QUERY.product_video_set,
      watch_until: BUILDER.watchUntil,
      pending_until: BUILDER.pendingUntil,
      shipping_until: BUILDER.shippingUntil,
      expire_until: BUILDER.expireUntil,
    };

    console.log(orderData);

    const columns = Object.keys(orderData);

    const values = Object.values(orderData);

    const schemeData = `
        INSERT INTO orders (${columns.join(", ")})
        VALUES (${columns.map(() => "?").join(", ")})
      `;

    await connection.execute(schemeData, values);

    await connection.commit();

    return {
      success: true,
      payload: {
        cbor: BUILDER.cbor,
        order: BUILDER.threadTokenPolicyId,
      },
    };
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    if (err instanceof GraphQLError) throw err;

    throw new GraphQLError("pendingEndpointError", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { pendingEndpoint };
