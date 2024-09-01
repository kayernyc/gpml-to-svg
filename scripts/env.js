const fs = require('fs');

const { dirname, join } = require('path');
// Path to package.json
const packageJsonPath = join(__dirname, '../package.json');

try {
  const data = fs.readFileSync(packageJsonPath, 'utf-8');
  const config = JSON.parse(data);

  const content = `
    export const VERSION = "${config.version}";
  `;

  fs.writeFile('./src/constants/BUILD.ts', content, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Global build file written successfully. Version: ${config.version}`,
      );
    }
  });
} catch (err) {
  console.error(err);
}
