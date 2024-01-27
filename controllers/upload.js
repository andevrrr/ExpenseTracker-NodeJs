const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const outputFilePath = path.join(__dirname, "data.json");

const categorizeTransaction = async (transaction, categories) => {
    const prompt = `
    Transaction details:
    - Payer: ${transaction.payer}
    - Receiver: ${transaction.businessName}
    - Amount: ${transaction.amount}
    - Type: ${transaction.transactionType}

    This transaction is part of a bank statement from a Finnish user, reflecting various daily activities and expenses. Based on the provided details, especially focusing on the transaction type, receiver, and amount, categorize this transaction into one of the following categories, considering typical spending patterns in Finland: ${categories.join(", ")}.

    If the transaction details are insufficient to determine a specific category, especially for ambiguous entries like transfers or generic payments, please indicate it as "Other". Ensure to choose the most fitting category based on the Finnish context.
    `.trim();

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 60,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("An error occurred:", error);
    return "Error: Unable to categorize";
  }
};

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
    "Else"
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
