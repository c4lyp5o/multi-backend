const fs = require('fs/promises');

async function generateEnvFile() {
  const buffer = `PORT="6565"\nWELCOME_MESSAGE="Welcome to the multi-backend"\nSQLITE_DATABASE_URL="file:../db/multi-backend.db"\n`;
  await fs.writeFile('.env', buffer, { flags: 'w' });
  console.log('env file generated');
}

generateEnvFile();
