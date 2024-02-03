exports.getData = (req, res) => {
  if (req.session.transactions) {
    res.json(req.session.transactions);
  } else {
    console.log("not available");
    res.status(404).send("No data available");
  }
};

exports.updateCategory = (req, res) => {
  const { id, newCategory } = req.body;

  if (req.session.transactions) {
    const transactions = req.session.transactions.map((transaction) => {
      if (transaction.id === id) {
        return { ...transaction, category: newCategory };
      }
      return transaction;
    });

    req.session.transactions = transactions;
    res.json({ message: "Category updated successfully." });
  } else {
    res.status(404).send("Session or transaction not found.");
  }
};

exports.deleteSession = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Session deletion error:", err);
      res.status(500).send("Could not delete the session.");
    } else {
      res.json({ message: "Session deleted successfully." });
    }
  });
};
