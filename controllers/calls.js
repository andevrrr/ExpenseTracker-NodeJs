const fs = require("fs");

exports.getSession = (req, res) => {
  if (req.session) {
    res.json({ sessionValid: true, message: "Session is valid" });
  } else {
    res
      .status(401)
      .json({ sessionValid: false, message: "Session is invalid or expired" });
  }
};

exports.getData = (req, res) => {
  if (req.session && req.session.transactions) {
    res.json({ transactions: req.session.transactions });
  } else {
    console.log("Transaction data not available in the session.");
    res.status(404).send({ message: "No transaction data available." });
  }
};

exports.addCategory = (req, res) => {
  const { purchase, categoryTitle } = req.body;

  if (!req.session || !req.session.transactions) {
    return res
      .status(404)
      .send({ message: "Session or transactions not found." });
  }

  if (!purchase || !categoryTitle) {
    return res
      .status(400)
      .send({ message: "Missing purchase or category title in the request." });
  }

  if (!["income", "outcome"].includes(categoryTitle)) {
    return res.status(400).send({
      message:
        "Invalid category type specified. Choose either 'income' or 'outcome'.",
    });
  }

  const categoryList = req.session.transactions[`${categoryTitle}Categories`];

  if (typeof purchase !== "object" || !purchase.id) {
    return res.status(400).send({ message: "Invalid purchase structure." });
  }

  categoryList.push(purchase);

  res.json({
    message: "Purchase added successfully.",
    transactions: req.session.transactions,
  });
};

exports.updateCategory = (req, res) => {
  const { id, categoryTitle, newCategory } = req.body;

  if (!req.session || !req.session.transactions) {
    return res
      .status(404)
      .send({ message: "Session or transactions not found." });
  }

  const transactionsList =
    req.session.transactions[`${categoryTitle}Categories`];
  if (!transactionsList) {
    return res
      .status(400)
      .send({ message: "Invalid category title specified." });
  }

  const transactionIndex = transactionsList.findIndex((t) => t.id === id);
  if (transactionIndex === -1) {
    return res.status(404).send({ message: "Transaction not found." });
  }

  transactionsList[transactionIndex].category = newCategory;
  res.json({
    message: "Category updated successfully.",
    transactions: req.session.transactions,
  });
};

exports.deleteSession = (req, res) => {
  if (!req.session || !req.session.filePath) {
    return res.status(400).send({ message: "No file or session to delete." });
  }

  fs.unlink(req.session.filePath, (err) => {
    if (err) {
      console.error("File deletion error:", err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Session deletion error:", sessionErr);
        return res
          .status(500)
          .send({ message: "Could not delete the session." });
      } else {
        res.json({ message: "Session and file deleted successfully." });
      }
    });
  });
};
