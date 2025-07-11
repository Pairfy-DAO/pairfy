export function chunkMetadata(str: string, size: number): string[] {
    if (!str || size <= 0) return [];
  
    const chunks: string[] = [];
  
    for (let i = 0; i < str.length; i += size) {
      chunks.push(str.slice(i, i + size));
    }
  
    return chunks;
  }