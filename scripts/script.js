const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const categorizeTransaction = async (transaction, categories) => {
  const prompt = `
    Transaction details:
    - Payer: ${transaction.payer}
    - Receiver: ${transaction.businessName}
    - Amount: ${transaction.amount}
    - Type: ${transaction.transactionType}

    This transaction is part of a bank statement from a Finnish user, reflecting various daily activities and expenses. Based on the provided details, categorize this transaction into one of the following categories, considering typical spending patterns in Finland: ${categories.join(
      ", "
    )}.

    If the transaction details are insufficient to determine a specific category, especially for ambiguous entries like transfers or generic payments, please indicate it as "Other". Ensure to choose the most fitting category based on the Finnish context. Your answer must strictly be the name of the category and nothing else.
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

module.exports = categorizeTransaction;
