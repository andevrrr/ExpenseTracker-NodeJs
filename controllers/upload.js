const fs = require("fs");
const csv = require("csv-parser");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);
const categorizeTransaction = require("../scripts/script.js");
const { income, outcome } = require("./categories.js");

exports.postUploadFile = async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).send("No file uploaded or file path missing.");
  }

  try {
    const filePath = req.file.path;
    req.session.filePath = filePath;

    const transactions = await parseCSV(filePath);
    const categorizedTransactions = await categorizeTransactions(transactions);

    req.session.transactions = categorizeByType(categorizedTransactions);

    await req.session.save();
    res.json(categorizedTransactions);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Error processing file");
  } finally {
    await unlinkAsync(req.file.path).catch(console.error);
  }
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    let transactionId = 0;
    const transactions = [];
    fs.createReadStream(filePath)
      .pipe(
        csv({
          separator: ";",
          headers: [
            "Kirjauspäivä",
            "Maksupäivä",
            "Summa",
            "Tapahtumalaji",
            "Maksaja",
            "Saajan_nimi",
          ],
        })
      )
      .on("data", (data) => {
        transactionId++;
        transactions.push(formatTransaction(data, transactionId));
      })
      .on("end", () => resolve(transactions))
      .on("error", reject);
  });
};

const formatTransaction = (data, id) => ({
  id,
  paymentDate: data.Maksupäivä.split(".").reverse().join("-"),
  businessName: data.Saajan_nimi,
  payer: data.Maksaja,
  amount: data.Summa.replace(",", "."),
  transactionType: data.Tapahtumalaji,
});

const categorizeTransactions = async (transactions) => {
  for (const transaction of transactions) {
    transaction.category = await categorizeTransaction(
      transaction,
      parseFloat(transaction.amount) > 0 ? income : outcome
    );
  }
  return transactions;
};

const categorizeByType = (transactions) => ({
  incomeCategories: transactions.filter((t) => parseFloat(t.amount) > 0),
  outcomeCategories: transactions.filter((t) => parseFloat(t.amount) <= 0),
});
