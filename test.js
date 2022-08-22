// import { PrismaClient as PrismaClient2 } from '../../prisma/generated/client2';
const { PrismaClient } = require('./prisma/generated/client2');

const prisma = new PrismaClient();

async function main(req, res) {
  // Connect the client
  await prisma.$connect();
  // ... you will write your Prisma Client queries here
  //   const allUsers = await prisma.test.findMany();
  //   if (!allUsers) {
  //     console.log('No users found');
  //     return res.send('could not find users');
  //   }
  //   console.log(allUsers);
  //   res.send(allUsers);
  await prisma.test.create({
    data: {
      title: 'Alice',
      body: 'alice@prisma.io',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
