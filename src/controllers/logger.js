import fs, { mkdirSync } from 'fs';
import path from 'path';
import fsPromises, { mkdir } from 'fs/promises';
import { Buffer } from 'buffer';

async function logToFile(req, res) {
  const { app, message } = req.body;
  if (!app || !message) {
    return res.status(400).send({
      message:
        'You need to post json of { "app":"something", "message":"something" }. Remove the backslashes',
    });
  }
  try {
    const data = new Uint8Array(
      Buffer.from(
        `${new Date().toLocaleTimeString()}, ${new Date().toLocaleDateString()} - ${app} - ${message}\n`
      )
    );
    const promise = await fsPromises.writeFile(`./logs/${app}.log`, data, {
      flag: 'a',
    });
    res.status(200).json(promise);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err });
  }
  // const logFile = fs.createWriteStream(`./logs/${body.app}.txt`, { flags: 'a' });
  // logFile
  // .on('open', () => {
  //   logFile.write(`${new Date().toLocaleTimeString()}, ${new Date().toLocaleDateString()} - ${app} - ${message}\n`);
  // })
  // .on('finish', () => {
  //   logFile.destroy();
  // });
}

async function displayLogFile(req, res) {
  try {
    const { app } = req.query;
    const dirPath = path.resolve(process.cwd(), 'logs');
    fs.readdir(dirPath, async (err, files) => {
      if (err) mkdirSync(dirPath);
      console.log(files);
      if (!files.includes(`${app}.log`)) {
        return res.status(400).send({ message: 'No log file found' });
      } else {
        const file = path.resolve(process.cwd(), 'logs', `${app}.log`);
        // const logFile = fs.createReadStream(file);
        // logFile
        //   .on('data', (data) => {
        //     console.log('sending data');
        //     res.write(data);
        //     logFile.destroy();
        //     console.log('stream destroyed');
        //   })
        //   .on('close', () => {
        //     console.log('data closed');
        //     res.status(200).end();
        //   });
        await fsPromises.copyFile(
          file,
          path.resolve(process.cwd(), 'logs', `${app}_copy.log`)
        );
        const sendLog = await fsPromises.readFile(
          path.resolve(process.cwd(), 'logs', `${app}_copy.log`),
          'utf-8'
        );
        await fsPromises.unlink(
          path.resolve(process.cwd(), 'logs', `${app}_copy.log`)
        );
        res.status(200).json(sendLog);
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'No such file' });
  }
}

async function clearAllLogs(req, res) {
  const dirPath = path.resolve(process.cwd(), 'logs');
  try {
    fs.readdir(dirPath, (err, files) => {
      if (err) throw err;
      console.log(files);
      for (const file of files) {
        fs.unlink(path.join(dirPath, file), (err) => {
          if (err) throw err;
        });
      }
    });
    res.status(200).json({ message: 'logs cleared' });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
}

export { logToFile, displayLogFile, clearAllLogs };
