// import { PrismaClient as PrismaClient1 } from '../../prisma/generated/client1';
// import { PrismaClient as PrismaClient2 } from '../../prisma/generated/client2';
import { PrismaClient as PrismaSQLite } from '../../prisma/generated/client3';

// const prisma1 = new PrismaClient1();
// const prisma2 = new PrismaClient2();
const sqliteDb = new PrismaSQLite();

async function listData(req, res) {
  try {
    // await prisma1.$connect();
    // await prisma2.$connect();
    // const usersFromPostgre = await prisma1.test.findMany();
    // const usersFromMongo = await prisma2.test.findMany();
    const usersFromSqlite = await sqliteDb.test.findMany();
    if (!usersFromSqlite) {
      return res.status(400).send({ message: 'No users found' });
    }
    return res.json({
      // usersFromPostgre: usersFromPostgre,
      // usersFromMongo: usersFromMongo,
      usersFromSqlite: usersFromSqlite,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function sendData(req, res) {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).send({
      message:
        'You need to post json of { "title":"something", "body":"something" }. Remove the backslashes',
    });
  }
  try {
    // prisma1.$connect();
    // prisma2.$connect();
    // sqliteDb.$connect();
    // await prisma1.test.create({
    //   data: {
    //     title: title,
    //     body: body,
    //   },
    // });
    // await prisma2.test.create({
    //   data: {
    //     title: title,
    //     body: body,
    //   },
    // });
    await sqliteDb.test.create({
      data: {
        title: title,
        body: body,
      },
    });
    // const allUsersPostgre = await prisma1.test.findMany();
    // const allUsersMongo = await prisma2.test.findMany();
    const allUsersSqlite = await sqliteDb.test.findMany();
    if (!allUsersSqlite) {
      return res.status(400).send({ message: 'No users found' });
    }
    // console.log(allUsers, { depth: null });
    return res.json({
      data: { sqlite: allUsersSqlite },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { listData, sendData };
