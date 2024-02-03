const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const categorizeTransaction = require("../scripts/script.js");

const outputFilePath = path.join(__dirname, "data.json");

exports.postUploadFile = (req, res) => {
  const filePath = req.file.path;
  const outcome = [
    "Transportation",
    "Subscriptions and Memberships",
    "Housing and Leasing",
    "Transfers",
    "Groceries", // Ruokakaupat
    "Utilities", // Käyttömenot
    "Dining", // Ruokailu
    "Entertainment", // Viihde
    "Travel and Accommodation", // Matkustus
    "Healthcare", // Terveydenhuolto
    "Fashion", // Muoti
    "Recreation", // Vapaa-aika
    "Technology and Electronics", // Teknologia
    "Homeware", // Kotitavarat
    "Education", // Koulutus
    "Finance", // Rahoitus
    "Pets", // Lemmikit
    "Hobbies", // Harrastukset
    "E-Commerce", // Verkkokauppa
    "Services", // Palvelut
    "Eco", // Ekologisuus
    "Taxi", // Taksi
    "Bars", // Baarit
    "Clubs", // Klubit
    "Fitness", // Kuntoilu
    "Beauty", // Kauneus
    "Books", // Kirjat
    "Games", // Pelit
    "Gifts", // Lahjat
    "Music", // Musiikki
    "Sports", // Urheilu
    "Outdoor", // Ulkoilu
    "Other",
  ];

  const income = [
    "Salary/Wages",
    "Deposits",
    "Transfers",
    "Mobile Payment",
    "Interest",
    "Dividends",
    "Gifts",
    "Rental Income",
    "Other",
  ];

  const incomeTransactions = [];
  const outcomeTransactions = [];

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
      // Format paymentDate to YYYY-MM-DD
      let formattedDate = data.Maksupäivä.split(".").reverse().join("-");

      // Convert amount to use period as decimal separator and adjust the sign if necessary
      let formattedAmount = data.Summa.replace(",", ".");

      const transaction = {
        paymentDate: formattedDate,
        businessName: data.Saajan_nimi,
        payer: data.Maksaja,
        amount: formattedAmount,
        transactionType: data.Tapahtumalaji,
      };
      transactions.push(transaction);
    })
    .on("end", async () => {
      let transactionId = 0;
      const categorizedTransactions = [];
      for (let transaction of transactions) {
        transaction.id = ++transactionId;

        if (parseFloat(transaction.amount) > 0) {
          // Categorize positive amount as income
          transaction.category = await categorizeTransaction(
            transaction,
            income
          );
          incomeTransactions.push(transaction);
        } else {
          // Categorize negative amount as outcome
          transaction.category = await categorizeTransaction(
            transaction,
            outcome
          );
          outcomeTransactions.push(transaction);
        }

        categorizedTransactions.push(transaction);
      }

      req.session.incomeTransactions = incomeTransactions;
      req.session.outcomeTransactions = outcomeTransactions;

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Internal server error");
        }
        console.log("Session ID:", req.sessionID);

        console.log("Categorized transactions stored in session.");
        res.json(categorizedTransactions);
      });
    });
};
