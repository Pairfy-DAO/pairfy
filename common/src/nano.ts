import { customAlphabet } from "nanoid";
import { z } from "zod";

export function createId(alphabet: string, length: number): string {
  if (!alphabet || typeof alphabet !== "string") {
    throw new Error("Invalid alphabet");
  }

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer");
  }

  return customAlphabet(alphabet, length)();
}

export const getSellerId = () =>{
  return createId("0123456789ABCD", 21)
}

export const productIdRegex = /^PRD-\d{6}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{7}$/;

export const productIdSchema = z.string().regex(productIdRegex, {
  message: 'Invalid product ID format. Expected format: PRD-YYMMDD-XXXXXXX',
});

export const getProductId = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  const generate = customAlphabet(alphabet, 7);      
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, ''); 
  return `PRD-${date}-${generate()}`;                  
};

export const getEventId = () =>{
  return createId("abcdefghijklmnopqrstuvwxyz0123456789", 21)
}

export const getFileId = () =>{
  return createId('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789', 16)
}

export const getMediaGroupId = () => {
  const raw = createId('0123456789abcdef', 32)

  return [
    raw.slice(0, 8),
    raw.slice(8, 12),
    raw.slice(12, 16),
    raw.slice(16, 20),
    raw.slice(20),
  ].join('-');
};