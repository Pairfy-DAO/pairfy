import { MinioWrap } from "@pairfy/common";

export const minioClient = new MinioWrap()

export async function ensureBucketExists(client: Client, bucketName: string): Promise<void> {
    const exists = await client.bucketExists(bucketName);
    if (!exists) {
      await client.makeBucket(bucketName, "");
      console.log(`🪣 Created bucket: ${bucketName}`);
    }
  }