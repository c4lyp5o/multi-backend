import fs from 'fs';

function logToFile(req, res) {
  console.log(req.body);
  const { app, message } = req.body;
  if (!app || !message) {
    return res.status(400).send({ message: 'No app name or message found' });
  }
  const logFile = fs.createWriteStream(`./logs/${app}.txt`, { flags: 'a' });
  logFile.write(
    `${req.method} ${req.url} ${app} - ${new Date()}\n${message}\n`
  );
  res.status(200).json({ message: 'logged' });
}

function displayLogFile(req, res) {
  console.log(req.query);
  const { app } = req.query;
  const file = `./logs/${app}.txt`;
  if (!file) {
    return res.status(400).send({ message: 'No log file found' });
  }
  const logFile = fs.createReadStream(`./logs/${app}.txt`);
  logFile.pipe(res);
}

export { logToFile, displayLogFile };
