const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const categorizeTransaction = require("../scripts/script.js");

const outputFilePath = path.join(__dirname, "data.json");

exports.postUploadFile = (req, res) => {
  const filePath = req.file.path;
  const categories = [
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
    "Else",
  ];

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
      const transaction = {
        paymentDate: data.Maksupäivä,
        businessName: data.Saajan_nimi,
        payer: data.Maksaja,
        amount: data.Summa,
        transactionType: data.Tapahtumalaji,
      };
      transactions.push(transaction);
    })
    .on("end", async () => {
      const categorizedTransactions = [];
      for (let transaction of transactions) {
        transaction.category = await categorizeTransaction(
          transaction,
          categories
        );
        categorizedTransactions.push(transaction);
      }

      fs.writeFile(
        outputFilePath,
        JSON.stringify(categorizedTransactions, null, 2),
        (err) => {
          if (err) {
            console.error("Failed to save categorized transactions:", err);
            return res.status(500).send("Failed to process the file.");
          }

          console.log("Categorized transactions saved successfully.");
          res.json(categorizedTransactions); // Respond with the categorized transactions
        }
      );
    });
};
