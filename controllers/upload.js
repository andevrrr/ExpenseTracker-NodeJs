const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const categorizeTransaction = async (transaction, categories) => {
  const prompt = `'${transaction.payer}' is the payer, '${
    transaction.transactionType
  }' is the transaction type, and '${
    transaction.businessName
  }' is the receiver. This is a bank statement from a user where you can see their purchases, transfers, etc. To categorize a transaction, consider transactions with both a name and surname in both the receiver and payer fields. Determine the most appropriate category for this transaction from the following list: ${categories.join(
    ", "
  )}. Answer in just one of the categories from the list.`;

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
    console.log(response.data.choices[0].text.trim());
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("An error occurred:", error);
    return "Error: Unable to categorize";
  }
};

exports.postUploadFile = (req, res) => {
  const filePath = req.file.path;
  const categories = [
    "Groceries",
    "Utilities",
    "Entertainment",
    "Dining and Restaurants",
    "Transportation",
    "Healthcare",
    "Clothing and Apparel",
    "Technology and Electronics",
    "Subscriptions and Memberships",
    "Home and Garden",
    "Education",
    "Travel and Accommodation",
    "Gifts and Donations",
    "Financial Services",
    "Sports and Recreation",
    "Housing and Leasing",
    "Transfers",
    "Taxi",
  ];

  const transactions = [];

  fs.createReadStream(filePath)
    .pipe(
      csv(["amount", "paymentDate", "payer", "businessName", "transactionType"])
    )
    .on("data", (data) => transactions.push(data))
    .on("end", async () => {
      for (let transaction of transactions) {
        transaction.category = await categorizeTransaction(
          transaction,
          categories
        );
      }

      res.json(transactions);
    });
};
