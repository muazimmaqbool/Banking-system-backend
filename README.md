# Banking System Backend

A Node.js + Express + MongoDB-based backend for a simple banking system. This project handles user authentication, account management, balance checks, secure fund transfers, and transaction tracking with JWT authentication and MongoDB transactions.

## Features

- User registration and login
- JWT-based authentication
- Cookie-based token storage
- Account creation per user
- Balance inquiry
- Internal ledger-based accounting
- Fund transfer between accounts
- Idempotent transaction protection with `idempotencyKey`
- System-user support for initial funding
- Email notifications for registration and transactions

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- nodemailer
- dotenv

## Project Structure

```text
Banking-system-backend/
├── server.js
├── package.json
├── .gitignore
├── project-workflow.txt
├── src/
│   ├── app.js
│   ├── Config/
│   │   └── db.js
│   ├── Controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── Models/
│   │   ├── account.model.js
│   │   ├── blackList.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── Routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   └── services/
│       └── email.js
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or access to MongoDB Atlas
- A valid `.env` file

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/banking-system
JWT_SECRET_KEY=your_super_secret_key
```

## Installation

```bash
npm install
```

## Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server starts on:

```text
http://localhost:3000
```

## Base URL

All API routes are scoped under:

```text
http://localhost:3000
```

---

# API Endpoints

## 1) Health Check

### GET /

Checks if the server is running.

Example:

```bash
curl http://localhost:3000/
```

Response:

```text
Banking server is working
```

---

## 2) Authentication

Base path:

```text
/api/auth
```

### A. Register User

### POST /api/auth/register

Creates a new user and returns a JWT token.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Example:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'
```

Successful response:

```json
{
  "user": {
    "_id": "64b...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

This also sets a cookie named `token`.

---

### B. Login User

### POST /api/auth/login

Authenticates an existing user and returns a JWT token.

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Example:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'
```

Successful response:

```json
{
  "user": {
    "_id": "64b...",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### C. Logout User

### POST /api/auth/logout

Logs the user out by blacklisting the token and clearing the cookie.

Example:

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer your_jwt_token"
```

Or via cookie if it is saved in browser.

Response:

```json
{
  "message": "User logged out successfully"
}
```

---

## 3) Account Management

Base path:

```text
/api/accounts
```

These endpoints require authentication.

### A. Create Account

### POST /api/accounts/

Creates a new account for the logged-in user.

Example:

```bash
curl -X POST http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer your_jwt_token"
```

Successful response:

```json
{
  "newAccount": {
    "user": "64b...",
    "status": "ACTIVE",
    "currency": "INR",
    "_id": "64c...",
    "createdAt": "2026-09-27T03:30:03.280Z",
    "updatedAt": "2026-09-27T03:30:03.280Z",
    "__v": 0
  }
}
```

---

### B. Get All Accounts

### GET /api/accounts/

Returns all accounts belonging to the authenticated user.

Example:

```bash
curl http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer your_jwt_token"
```

Response:

```json
{
  "accounts": [
    {
      "_id": "64c...",
      "user": "64b...",
      "status": "ACTIVE",
      "currency": "INR"
    }
  ]
}
```

---

### C. Get Account Balance

### GET /api/accounts/balance/:accountId

Returns the balance of a specific account owned by the logged-in user.

Example:

```bash
curl http://localhost:3000/api/accounts/balance/64c... \
  -H "Authorization: Bearer your_jwt_token"
```

Response:

```json
{
  "accountId": "64c...",
  "balance": 2500
}
```

---

## 4) Transactions

Base path:

```text
/api/transactions
```

### A. Transfer Money Between Accounts

### POST /api/transactions/

Transfers funds from one account to another.

Request body:

```json
{
  "fromAccount": "64d...",
  "toAccount": "64e...",
  "amount": 1000,
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

Example:

```bash
curl -X POST http://localhost:3000/api/transactions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "fromAccount": "64d...",
    "toAccount": "64e...",
    "amount": 1000,
    "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }'
```

Successful response:

```json
{
  "message": "Transaction completed successfully",
  "transaction": {
    "_id": "64f...",
    "fromAccount": "64d...",
    "toAccount": "64e...",
    "amount": 1000,
    "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "COMPLETED"
  }
}
```

Important:
- `fromAccount`, `toAccount`, `amount`, and `idempotencyKey` are required
- the sender must have sufficient balance
- `idempotencyKey` prevents duplicate processing
- both accounts must be `ACTIVE`

---

### B. Initial Funds by System User

### POST /api/transactions/system/initial-funds

Adds initial funds to an account from a bank/system user.

Request body:

```json
{
  "toAccount": "64e...",
  "amount": 10000,
  "idempotencyKey": "system-initial-funds-001"
}
```

Example:

```bash
curl -X POST http://localhost:3000/api/transactions/system/initial-funds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer system_user_token" \
  -d '{
    "toAccount": "64e...",
    "amount": 10000,
    "idempotencyKey": "system-initial-funds-001"
  }'
```

Response:

```json
{
  "message": "Initial funds transaction completed successfully",
  "transaction": {
    "_id": "64g...",
    "fromAccount": "64system...",
    "toAccount": "64e...",
    "amount": 10000,
    "idempotencyKey": "system-initial-funds-001",
    "status": "COMPLETED"
  }
}
```

---

# Authentication & Authorization

The API uses JWT-based authentication.

How requests are authenticated:
- Pass the token in the `Authorization` header:
  ```http
  Authorization: Bearer <token>
  ```
- Or use the `token` cookie set by the login/register endpoints

Protected routes validate:
- the token exists
- the token is not blacklisted
- the token is valid and not expired

---

# How Balance Is Calculated

The balance is computed from the ledger entries:

- `DEBIT` entries decrease balance
- `CREDIT` entries increase balance

Formula:

```text
Balance = Total Credits - Total Debits
```

This ledger is the source of truth for all financial movement in the app.

---

# Data Models

## User Model

Fields:
- `name`
- `email`
- `password`
- `systemUser` (optional)

Password is hashed with `bcryptjs` before saving.

## Account Model

Fields:
- `user`
- `status` (`ACTIVE`, `FROZEN`, `CLOSED`)
- `currency` (default: `INR`)

## Transaction Model

Fields:
- `fromAccount`
- `toAccount`
- `amount`
- `status`
- `idempotencyKey`

## Ledger Model

Fields:
- `account`
- `amount`
- `transaction`
- `type` (`DEBIT` / `CREDIT`)

Ledger entries are intentionally immutable, so the system maintains an auditable transaction history.

---

# Notes

- `idempotencyKey` is required for transaction requests to prevent duplicate transfers.
- The project uses MongoDB transactions to ensure atomicity.
- User logout blacklists the JWT to invalidate future access.
- The system-user flow is used for bank-owned initial balance funding.

---

# Example Full Flow

1. Register:
   ```bash
   POST /api/auth/register
   ```

2. Login:
   ```bash
   POST /api/auth/login
   ```

3. Create an account:
   ```bash
   POST /api/accounts/
   ```

4. Check accounts:
   ```bash
   GET /api/accounts/
   ```

5. Check balance:
   ```bash
   GET /api/accounts/balance/:accountId
   ```

6. Transfer funds:
   ```bash
   POST /api/transactions/
   ```

7. Logout:
   ```bash
   POST /api/auth/logout
   ```

---

# Troubleshooting

### MongoDB connection error
Make sure `MONGO_URI` is correct in `.env`.

### Unauthorized access
Ensure the JWT token is included in the request.

### Insufficient balance
The sender account must have enough balance for the transaction.

---

# License

This project uses the ISC license as defined in the `package.json` file.
