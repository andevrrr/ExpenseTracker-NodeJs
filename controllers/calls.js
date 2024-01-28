exports.getData = (req, res) => {
  if (req.session.transactions) {
    res.json(req.session.transactions);
  } else {
    console.log("not available");
    res.status(404).send("No data available");
  }
};
