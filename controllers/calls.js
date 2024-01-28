exports.getData = (req, res) => {
  console.log(req.session.transactions);
  if (req.session.transactions) {
    res.json(req.session.transactions);
  } else {
    console.log("not available");
    res.status(404).send("No data available");
  }
};

exports.updateCategory = (req, res) => {
  const { paymentDate, businessName, newCategory } = req.body;

  if (req.session.transactions) {
    const transactions = req.session.transactions.map((transaction) => {
      if (
        transaction.paymentDate === paymentDate &&
        transaction.businessName === businessName
      ) {
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
