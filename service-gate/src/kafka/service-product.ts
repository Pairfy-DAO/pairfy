import DB from "../db";
import kafka from "./client";
import { _ } from "../utils/pino";
import { stringToTimestamp } from "../utils/other";

const TOPIC_NAME = "fullfillment.service_product.product";
const CONSUMER_GROUP = "service-gate-group";

const serviceProductListener = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

  await consumer
    .connect()
    .then(() =>
      consumer.subscribe({
        topic: TOPIC_NAME,
        fromBeginning: true,
      })
    )
    .then(() =>
      consumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
          if (!message.value) return;

          const payload = JSON.parse(message.value.toString()).payload;

          console.log(payload);

          if (payload.op === "c") {
            await handleCreate(payload, consumer, {
              topic,
              partition,
              message,
            });
          }

          if (payload.op === "u") {
            await handleUpdate(payload, consumer, {
              topic,
              partition,
              message,
            });
          }

          if (payload.op === "d") {
            await handleDelete(payload, consumer, {
              topic,
              partition,
              message,
            });
          }
        },
      })
    )
    .catch((err: any) => _.error(err));
};

const handleCreate = async (
  data: any,
  consumer: any,
  { topic, partition, message }: any
) => {
  const payload = data.after;

  payload.created_at = stringToTimestamp(payload.created_at);
  payload.schema_t = stringToTimestamp(payload.schema_t);

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    INSERT INTO product (
      product_id,
      seller_id,
      name,
      description,
      category,
      price,
      collateral,
      stock,
      stock_status,
      slots,
      keywords,
      theme,
      country,
      moderated,
      image_base,
      image_path,
      image_main,
      image_set,
      created_at,
      schema_t,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = Object.values(payload);

    const [rows] = await connection.execute(
      "SELECT * FROM product WHERE product_id = ?",
      [payload.product_id]
    );

    if (rows.length !== 0) {
      throw new Error("DUPLICATION");
    }

    const [created] = await connection.execute(schemeData, schemeValue);

    if (created.affectedRows === 0) {
      throw new Error("NO_AFFECTED");
    }

    await connection.commit();

    await consumer.commitOffsets([
      { topic, partition, offset: message.offset + 1 },
    ]);
  } catch (err) {
    await connection.rollback().then(() => _.error(err));
  } finally {
    connection.release();
  }
};

const handleUpdate = async (
  data: any,
  consumer: any,
  { topic, partition, message }: any
) => {
  const payload = data.after;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    UPDATE product 
    SET product_id = ?,
        seller_id = ?,
        name = ?,
        description = ?,        
        category = ?,
        price = ?,
        collateral = ?,
        stock = ?,
        stock_status = ?,
        slots = ?,
        keywords = ?,
        theme = ?,
        country = ?,
        moderated = ?,        
        image_base = ?,
        image_path = ?,
        image_main = ?,
        image_set = ?,
        created_at = ?,
        schema_t = ?,
        schema_v = ?
    WHERE product_id = ? AND schema_v = ?`;

    const schemeValue = [
      ...Object.values(payload),
      payload.product_id,
      payload.schema_v - 1,
    ];

    const [updated] = await connection.execute(schemeData, schemeValue);

    if (updated.affectedRows === 0) {
      throw new Error("NO_AFFECTED");
    }

    await connection.commit();

    await consumer.commitOffsets([
      { topic, partition, offset: message.offset + 1 },
    ]);
  } catch (err) {
    await connection.rollback().then(() => _.error(err));
  } finally {
    connection.release();
  }
};

const handleDelete = async (
  data: any,
  consumer: any,
  { topic, partition, message }: any
) => {
  const payload = data.before;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const [deleted] = await connection.execute(
      "DELETE FROM product WHERE product_id = ? AND schema_v = ?",
      [payload.product_id, payload.schema_v]
    );

    if (deleted.affectedRows === 0) {
      throw new Error("NO_AFFECTED");
    }

    await connection.commit();

    await consumer.commitOffsets([
      { topic, partition, offset: message.offset + 1 },
    ]);
  } catch (err) {
    await connection.rollback().then(() => _.error(err));
  } finally {
    connection.release();
  }
};

export default serviceProductListener;
