async function echoService(req, res) {
  try {
    const { msg } = req.query;
    res.status(200).json({ message: msg });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

export { echoService };
