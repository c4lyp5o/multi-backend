import { PrismaClient as PrismaClient1 } from '../../prisma/generated/client1';
import { PrismaClient as PrismaClient2 } from '../../prisma/generated/client2';

const prisma1 = new PrismaClient1();
const prisma2 = new PrismaClient2();

async function listData(req, res) {
  try {
    await prisma1.$connect();
    await prisma2.$connect();
    const usersFromPostgre = await prisma1.test.findMany();
    const usersFromMongo = await prisma2.test.findMany();
    return res.json({
      usersFromPostgre: usersFromPostgre,
      usersFromMongo: usersFromMongo,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function sendData(req, res) {
  try {
    const { title, body } = req.body;
    prisma1.$connect();
    prisma2.$connect();
    await prisma1.test.create({
      data: {
        title: title,
        body: body,
      },
    });
    await prisma2.test.create({
      data: {
        title: title,
        body: body,
      },
    });
    const allUsersPostgre = await prisma1.test.findMany();
    const allUsersMongo = await prisma2.test.findMany();
    // console.log(allUsers, { depth: null });
    return res.json({
      data: { postgre: allUsersPostgre, mongo: allUsersMongo },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { listData, sendData };
