const fs = require('fs/promises');

async function generateEnvFile() {
  const buffer = `PORT="6565"\nTEST_ENV_VARIABLE="Welcome to the multi-backend"\nSQLITE_DATABASE_URL="file:../db/multi-backend.db"\n`;
  await fs.writeFile('.env', buffer, { flags: 'w' });
  // await envFile(
  //   `PORT="6565"\nTEST_ENV_VARIABLE="Welcome to the multi-backend"\nSQLITE_DATABASE_URL="file:../db/multi-backend.db"\n`
  // );
  console.log('env file generated');
}

generateEnvFile();
