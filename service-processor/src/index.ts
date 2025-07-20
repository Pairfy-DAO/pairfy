import dotenv from 'dotenv';
import database from './database/client.js';
import { minioClient } from './database/minio.js';

dotenv.config();

export function main() {
    const requiredVars = [
      'DATABASE_HOST',
      'DATABASE_PORT',
      'DATABASE_USER',
      'DATABASE_PASSWORD',
      'DATABASE_NAME',
      'REDIS_PROCESSOR_HOST',
      'MINIO_HOST',
      'MINIO_PORT',
      'MINIO_USE_SSL',
      'MINIO_ROOT_USER',
      'MINIO_ROOT_PASSWORD',
    ];
  
    const missing = requiredVars.filter((key) => !process.env[key]);
  
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    database.connect({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT as string, 10),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    minioClient.connect({
      endPoint: process.env.MINIO_HOST as string,
      port: parseInt(process.env.MINIO_PORT as string, 10),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ROOT_USER as string,
      secretKey: process.env.MINIO_ROOT_PASSWORD as string,
    });

    
    console.log("Online")
  }
  

