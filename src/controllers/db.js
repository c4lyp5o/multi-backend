import { PrismaClient as PrismaClient1 } from '../../prisma/generated/client1';
import { PrismaClient as PrismaClient2 } from '../../prisma/generated/client2';

const prisma1 = new PrismaClient1();
const prisma2 = new PrismaClient2();

// class IndexController {
//   static async index(req, res) {
//     await prisma1.$connect();
//     await prisma2.$connect();
//     const usersFromPostgre = await prisma1.user.findMany();
//     const usersFromMongo = await prisma2.user.findMany();
//     if (!usersFromPostgre && !usersFromMongo) {
//       return res.status(404).json({ message: 'No users found' });
//     }
//     return res.json(
//       `usersFromPostgre: ${usersFromPostgre} usersFromMongo: ${usersFromMongo}`
//     );
//   }
// }

async function listData(req, res) {
  const { msg } = req.params;
  console.log(msg);
  await prisma1.$connect();
  await prisma2.$connect();
  const usersFromPostgre = await prisma1.user.findMany();
  const usersFromMongo = await prisma2.user.findMany();
  if (!usersFromPostgre && !usersFromMongo) {
    return res.status(404).json({ message: 'No users found' });
  }
  return res.json(
    `usersFromPostgre: ${usersFromPostgre} usersFromMongo: ${usersFromMongo}`
  );
}

async function sendData(req, res) {
  // prisma1.$connect();
  prisma2.$connect();
  // await prisma1.test.create({
  //   data: {
  //     title: 'Alice',
  //     body: 'alice@prisma.io',
  //   },
  // });
  await prisma2.test.create({
    data: {
      title: 'Alice',
      body: 'alice@prisma.io',
    },
  });

  const allUsers = await prisma2.test.findMany({});
  console.log(allUsers, { depth: null });
}

async function sendDataMongo(req, res) {
  await prisma2.user.create({
    data: {
      name: 'Rich',
      email: 'hello@prisma.com',
      posts: {
        create: {
          title: 'My first post',
          body: 'Lots of really interesting stuff',
          slug: 'my-first-post',
        },
      },
    },
  });

  const allUsers = await prisma2.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log(allUsers, { depth: null });
  res.status(200).json(allUsers);
}

export { listData, sendData, sendDataMongo };
