# API Documentation

Complete REST API documentation for the Secure Banking application.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Public Endpoints](#public-endpoints)
  - [Authenticated Endpoints](#authenticated-endpoints)
- [Response Codes](#response-codes)
- [API Examples](#api-examples)

## Overview

The Secure Banking API is a RESTful API built with Express.js that provides banking functionality including user registration, authentication, account management, and money transfers.

**API Version:** 1.0.0
**Protocol:** HTTP/HTTPS
**Data Format:** JSON
**Authentication:** JWT (JSON Web Token)

## Authentication

### JWT Bearer Token

Protected endpoints require a JWT token in the Authorization header.

**Header Format:**

```
Authorization: Bearer <your_jwt_token>
```

**Token Details:**

- **Type:** Bearer
- **Algorithm:** HS256
- **Expiration:** 30 minutes
- **Claim:** User email

**Obtaining a Token:**

1. Register a new account via `POST /register` and `POST /register/otp_validator`
2. Login via `POST /login`
3. Store the returned `token` value
4. Include it in subsequent requests

**Example:**

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/dashboard
```

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

### Common Error Codes

| Code                  | Description                                   |
| --------------------- | --------------------------------------------- |
| `INVALID_CREDENTIALS` | Email or password is incorrect                |
| `USER_NOT_FOUND`      | User does not exist                           |
| `USER_EXISTS`         | User with this email/phone already registered |
| `INVALID_OTP`         | OTP code is incorrect or expired              |
| `INSUFFICIENT_FUNDS`  | Account balance too low for transfer          |
| `INVALID_TOKEN`       | JWT token is invalid or expired               |
| `MISSING_TOKEN`       | No Authorization header provided              |
| `VALIDATION_ERROR`    | Request body validation failed                |

## Endpoints

### Public Endpoints

These endpoints do not require authentication.

---

#### **POST /login**

Authenticate user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**

- **409 Conflict** - User not found

  ```json
  {
    "message": "User not found"
  }
  ```

- **409 Conflict** - Invalid credentials
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

**Example:**

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@bank.com","password":"password123"}'
```

---

#### **POST /register**

Initiate user registration and send OTP.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Field Validations:**

- `name`: Required, string
- `email`: Required, valid email format, must be unique
- `phone`: Required, string, must be unique
- `password`: Required, string, minimum 6 characters (recommended)

**Success Response (200 OK):**

```json
{
  "message": "OTP sent successfully",
  "phone": "+1234567890"
}
```

**Error Responses:**

- **409 Conflict** - User already exists

  ```json
  {
    "message": "User already exists",
    "field": "email"
  }
  ```

- **500 Internal Server Error** - SMS sending failed
  ```json
  {
    "message": "Failed to send OTP"
  }
  ```

**Example:**

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Alice Johnson",
    "email":"alice@example.com",
    "phone":"+1234567891",
    "password":"securepass"
  }'
```

---

#### **POST /register/otp_validator**

Validate OTP and complete user registration.

**Request Body:**

```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Success Response (200 OK):**

```json
{
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**Process:**

1. Validates OTP against stored value
2. Creates user account
3. Creates balance account with initial $100
4. Deletes OTP record

**Error Responses:**

- **400 Bad Request** - Invalid OTP

  ```json
  {
    "message": "Invalid OTP"
  }
  ```

- **404 Not Found** - OTP not found (expired or never sent)
  ```json
  {
    "message": "OTP not found"
  }
  ```

**Example:**

```bash
curl -X POST http://localhost:5000/register/otp_validator \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","otp":"123456"}'
```

---

### Authenticated Endpoints

These endpoints require a valid JWT token in the Authorization header.

---

#### **GET /**

Check authentication status.

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "message": "Authenticated",
  "user": {
    "email": "user@example.com"
  }
}
```

**Error Response:**

- **401 Unauthorized** - Invalid or missing token

**Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/
```

---

#### **GET /dashboard**

Get user account balance and transaction history.

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "message": "Dashboard data fetched successfully",
  "data": {
    "balance": 1000.0,
    "Transaction": [100, -50, 200, -75, 150]
  }
}
```

**Transaction Array:**

- Positive values: Credits (received money)
- Negative values: Debits (sent money or spent)
- Chronological order (oldest to newest)

**Error Responses:**

- **401 Unauthorized** - Invalid or missing token
- **404 Not Found** - User balance not found

**Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/dashboard
```

---

#### **POST /transfer**

Transfer money to another user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "to_account": "recipient@example.com",
  "amount": 50.0
}
```

**Field Validations:**

- `to_account`: Required, valid email, must exist
- `amount`: Required, number, must be > 0

**Success Response (200 OK):**

```json
{
  "message": "Transfer successful",
  "data": {
    "from": "sender@example.com",
    "to": "recipient@example.com",
    "amount": 50.0,
    "newBalance": 950.0
  }
}
```

**Process:**

1. Validates sender has sufficient balance
2. Finds recipient by email
3. Deducts amount from sender
4. Adds negative transaction to sender's history
5. Adds amount to recipient
6. Adds positive transaction to recipient's history

**Error Responses:**

- **400 Bad Request** - Insufficient funds

  ```json
  {
    "message": "Insufficient balance"
  }
  ```

- **404 Not Found** - Recipient not found

  ```json
  {
    "message": "Recipient user not found"
  }
  ```

- **401 Unauthorized** - Invalid or missing token

**Example:**

```bash
curl -X POST http://localhost:5000/transfer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to_account":"bob@example.com","amount":50}'
```

---

#### **GET /register**

Get authenticated user's name.

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "name": "John Doe"
}
```

**Error Response:**

- **401 Unauthorized** - Invalid or missing token

**Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/register
```

---

#### **DELETE /register**

Delete user account and associated balance.

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

**Process:**

1. Deletes user balance record
2. Deletes user account

**Warning:** This action is irreversible!

**Error Response:**

- **401 Unauthorized** - Invalid or missing token

**Example:**

```bash
curl -X DELETE http://localhost:5000/register \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### **PUT /register/reset_balance**

Reset user balance to a specific amount.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "balance": 1000.0
}
```

**Success Response (200 OK):**

```json
{
  "message": "Balance reset successfully",
  "newBalance": 1000.0
}
```

**Note:** This is typically an admin function and should be secured appropriately in production.

**Error Response:**

- **401 Unauthorized** - Invalid or missing token

**Example:**

```bash
curl -X PUT http://localhost:5000/register/reset_balance \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"balance":1000}'
```

---

## Response Codes

| Code | Status                | Description                                  |
| ---- | --------------------- | -------------------------------------------- |
| 200  | OK                    | Request succeeded                            |
| 201  | Created               | Resource created successfully                |
| 400  | Bad Request           | Invalid request parameters                   |
| 401  | Unauthorized          | Missing or invalid authentication token      |
| 402  | Payment Required      | Insufficient funds for transaction           |
| 404  | Not Found             | Resource not found                           |
| 409  | Conflict              | Resource already exists or conflict occurred |
| 500  | Internal Server Error | Server error occurred                        |

## API Examples

### Complete User Flow

#### 1. Register a New User

```bash
# Step 1: Initiate registration
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Demo User",
    "email":"demo@bank.com",
    "phone":"+1234567890",
    "password":"password123"
  }'

# Response: OTP sent to phone

# Step 2: Validate OTP
curl -X POST http://localhost:5000/register/otp_validator \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"+1234567890",
    "otp":"123456"
  }'

# Response: User created with $100 initial balance
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo@bank.com",
    "password":"password123"
  }'

# Response:
# {
#   "token": "eyJhbGc...",
#   "user": {"email":"demo@bank.com","name":"Demo User"}
# }

# Save the token for subsequent requests
TOKEN="eyJhbGc..."
```

#### 3. View Dashboard

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/dashboard

# Response:
# {
#   "message": "Dashboard data fetched successfully",
#   "data": {
#     "balance": 100.00,
#     "Transaction": []
#   }
# }
```

#### 4. Transfer Money

```bash
curl -X POST http://localhost:5000/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to_account":"alice@example.com",
    "amount":25.00
  }'

# Response:
# {
#   "message": "Transfer successful",
#   "data": {
#     "from": "demo@bank.com",
#     "to": "alice@example.com",
#     "amount": 25.00,
#     "newBalance": 75.00
#   }
# }
```

#### 5. Check Updated Balance

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/dashboard

# Response:
# {
#   "message": "Dashboard data fetched successfully",
#   "data": {
#     "balance": 75.00,
#     "Transaction": [-25]
#   }
# }
```

### JavaScript/Axios Examples

#### Login Example

```javascript
import axios from "axios";

const API_URL = "http://localhost:5000";

async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    // Store token
    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Login failed:", error.response.data.message);
    }
    throw error;
  }
}

// Usage
login("demo@bank.com", "password123")
  .then((data) => console.log("Logged in:", data.user))
  .catch((err) => console.error(err));
```

#### Transfer Money Example

```javascript
async function transferMoney(recipientEmail, amount) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/transfer`,
      {
        to_account: recipientEmail,
        amount: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Transfer failed:", error.response.data.message);
    }
    throw error;
  }
}

// Usage
transferMoney("alice@example.com", 50.0)
  .then((data) => console.log("Transfer successful:", data))
  .catch((err) => console.error(err));
```

### Python Example

```python
import requests

API_URL = "http://localhost:5000"

# Login
response = requests.post(f"{API_URL}/login", json={
    "email": "demo@bank.com",
    "password": "password123"
})
token = response.json()["token"]

# Get Dashboard
headers = {"Authorization": f"Bearer {token}"}
dashboard = requests.get(f"{API_URL}/dashboard", headers=headers)
print(dashboard.json())

# Transfer Money
transfer = requests.post(
    f"{API_URL}/transfer",
    headers=headers,
    json={
        "to_account": "alice@example.com",
        "amount": 25.00
    }
)
print(transfer.json())
```

## Interactive API Documentation

Access the interactive Swagger UI at:

```
http://localhost:5000/api-docs
```

Features:

- Try out API endpoints directly
- View request/response schemas
- See example requests and responses
- Test authentication flows

## OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:

```
/server/docs/Bank-api-swagger.json
```

Import this file into tools like:

- Postman
- Insomnia
- Swagger Editor
- OpenAPI Generator

## Best Practices

### Security

1. **Never expose tokens**: Don't log or display JWT tokens
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate inputs**: Sanitize all user inputs
4. **Handle errors gracefully**: Don't expose sensitive error details

### Performance

1. **Cache tokens**: Store JWT in localStorage/sessionStorage
2. **Reuse connections**: Use connection pooling
3. **Implement retry logic**: Handle transient failures
4. **Use pagination**: For large transaction lists (future enhancement)

### Error Handling

```javascript
async function apiCall() {
  try {
    const response = await axios.get("/dashboard");
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        // Redirect to login
        window.location.href = "/login";
      } else {
        console.error("API Error:", error.response.data.message);
      }
    } else if (error.request) {
      // No response received
      console.error("Network error");
    } else {
      console.error("Request setup error");
    }
    throw error;
  }
}
```

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- User registration with OTP
- JWT authentication
- Account management
- Money transfers
- Dashboard with transaction history

---

**Last Updated:** 2025-01-26
**API Version:** 1.0.0
