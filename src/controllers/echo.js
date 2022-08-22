function echoService(req, res) {
  const { msg } = req.query;
  console.log(msg);
  res.status(200).json({ message: msg });
}

export { echoService };
