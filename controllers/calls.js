exports.getData = (req, res) => {
  if (req.session.transactions) {
    res.json(req.session.transactions);
  } else {
    console.log("not available");
    res.status(404).send("No data available");
  }
};

exports.updateCategory = (req, res) => {
  const { id, categoryTitle, newCategory } = req.body;

  if (req.session.transactions) {
    let updated = false;
    console.log(req.session.transactions);
    console.log(req.session.transactions.outcomeCategories);
    if (
      categoryTitle === "outcome" &&
      req.session.transactions.outcomeCategories
    ) {
      req.session.transactions.outcomeCategories =
        req.session.transactions.outcomeCategories.map((transaction) => {
          if (transaction.id === id) {
            updated = true;
            return { ...transaction, category: newCategory };
          }
          return transaction;
        });
    } else if (
      categoryTitle === "income" &&
      req.session.transactions.incomeCategories
    ) {
      req.session.transactions.incomeCategories =
        req.session.transactions.incomeCategories.map((transaction) => {
          if (transaction.id === id) {
            updated = true;
            return { ...transaction, category: newCategory };
          }
          return transaction;
        });
    }
    if (updated) {
      res.json({ message: "Category updated successfully." });
    } else {
      res.status(404).send("Transaction not found or invalid category title.");
    }
  } else {
    res.status(404).send("Session or transactions not found.");
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
