import fs from 'fs';
import path from 'path';

export function findFile(filePath: string, fileName: string): string | null {
  const absolutePath = path.resolve(filePath);
  const files = fs.readdirSync(absolutePath);

  for (const file of files) {
    const currentPath = path.join(absolutePath, file);
    const stats = fs.statSync(currentPath);

    if (stats.isFile() && file === fileName) {
      return currentPath;
    }

    if (stats.isDirectory()) {
      const foundPath = findFile(currentPath, fileName);
      if (foundPath) {
        return foundPath;
      }
    }
  }

  return null;
}

// Usage example
// const filePath = '/path/to/directory';
// const fileName = 'example.txt';
// const foundPath = findFile(filePath, fileName);

// if (foundPath) {
//   console.log(`Found file at: ${foundPath}`);
// } else {
//   console.log(`File '${fileName}' not found in '${filePath}' or its subdirectories.`);
// }
