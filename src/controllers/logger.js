import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
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
        `${app} - ${new Date().toLocaleTimeString()}, ${new Date().toLocaleDateString()}\n${message}\n`
      )
    );
    const promise = fsPromises.writeFile(`./logs/${app}.log`, data, {
      flag: 'a',
    });
    await promise;
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: err });
  }
  // const logFile = fs.createWriteStream(`./logs/${body.app}.txt`, { flags: 'a' });
  // logFile.write(
  //   `${req.method} ${req.url} ${app} - ${new Date()}\n${message}\n`
  // );
  res.status(200).json({ message: 'logged' });
}

async function displayLogFile(req, res) {
  try {
    const { app } = req.query;
    const file = `./logs/${app}.txt`;
    if (!file) {
      return res.status(400).send({ message: 'No log file found' });
    }
    const logFile = fs.createReadStream(`./logs/${app}.log`);
    await logFile.pipe(res);
  } catch (err) {
    return res.status(400).send({ message: 'No such file' });
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
  } catch (err) {
    return res.status(400).send({ message: err });
  }
  res.status(200).json({ message: 'logs cleared' });
}

export { logToFile, displayLogFile, clearAllLogs };
