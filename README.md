# Budgees Expense Tracker

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/antonkuch/)
[![Portfolio](https://img.shields.io/badge/portfolio-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://anton-kucherenko.com)

Budgees Expense Tracker is a web application developed to help users track their expenses efficiently. It allows users to upload bank statement files, categorize transactions, view detailed reports, and manage their financial data seamlessly.

## Features

- **Upload Bank Statements**: Users can upload their bank statement files in CSV format.
- **Categorize Transactions**: The application utilizes AI to categorize transactions automatically based on the provided details.
- **View Detailed Reports**: Users can view categorized transactions, analyze spending patterns, and track their expenses over time.
- **Manage Purchases**: Users can add, edit, and delete purchases, as well as manage categories.
- **Responsive Design**: The frontend is built using React.js, ensuring a responsive and user-friendly experience across devices.

## Technologies Used

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: OpenAI API for transaction categorization
- **Security**: Helmet, CORS, Express Rate Limit, Session Management with Redis

## Installation

1.  Clone the repository for the frontend and backend:
```
git clone https://github.com/andevrrr/ExpenseTracker-React-Bootstrap.git
git clone https://github.com/andevrrr/ExpenseTracker-NodeJs.git
```
2. Navigate to the project directories:
```
cd ExpenseTracker-React-Bootstrap
cd ExpenseTracker-NodeJs
```
3. Install dependencies for both frontend and backend:
```
npm install
```
4. Set up environment variables:
Provide values for environment variables.
5. Start the frontend and backend servers:
```
npm start
```
###### Open your browser and visit http://localhost:3000 to access the application.

## Usage

- **Upload Bank Statement**: Navigate to the upload page and select your bank statement file in CSV format.
- **Categorize Transactions**: The application will automatically categorize transactions using AI. Users can review and edit categories if needed.
- **View Reports**: Explore detailed reports, track expenses, and analyze spending patterns over time.
- **Manage Purchases**: Add, edit, or delete purchases as necessary to maintain accurate financial records.
License

This project is licensed under the MIT License.