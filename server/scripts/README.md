# Database Scripts

This directory contains utility scripts for database management and seeding.

## Available Scripts

### 🌱 Seed Database

Seeds the database with demo users, accounts, and transactions.

```bash
cd /home/amit9021/Secure-Banking
node scripts/seed.js
```

**What it does:**
- Clears existing data
- Creates 4 demo users with accounts
- Adds sample transactions to each account
- Displays demo credentials

**Demo Users:**
| Name | Email | Password | Initial Balance |
|------|-------|----------|----------------|
| Demo User | demo@bank.com | password123 | $1,000.00 |
| Alice Johnson | alice@example.com | password123 | $5,000.00 |
| Bob Smith | bob@example.com | password123 | $2,500.00 |
| Charlie Brown | charlie@example.com | password123 | $750.00 |

### 🔄 Reset Database

Clears all data from the database (requires confirmation).

```bash
cd /home/amit9021/Secure-Banking
node scripts/reset.js
```

**What it does:**
- Shows current database statistics
- Prompts for confirmation
- Deletes all users, balances, and OTPs

## Prerequisites

Before running these scripts, ensure:

1. **MongoDB is running:**
   ```bash
   # Using Docker Compose
   docker-compose -f infra/docker-compose.yml up mongodb -d

   # OR using local MongoDB
   mongod --dbpath=/path/to/data
   ```

2. **Environment variables are set:**
   - Scripts load from `server/.env`
   - Ensure `MONGODB_URI` is configured

3. **Dependencies are installed:**
   ```bash
   cd server
   npm install
   ```

## Troubleshooting

### Connection Errors

If you see "MongoDB connection error":
- Verify MongoDB is running
- Check `MONGODB_URI` in `server/.env`
- Ensure the URI format is correct: `mongodb://host:port/database`

### Module Not Found

If you see "Cannot find module":
- Run `npm install` in the `server` directory
- Ensure you're running from the project root

### Permission Denied

If you see permission errors:
- Ensure MongoDB has write permissions
- Check file system permissions on the DB directory

## Development Workflow

**Initial Setup:**
```bash
# 1. Start MongoDB
docker-compose -f infra/docker-compose.yml up mongodb -d

# 2. Seed the database
node scripts/seed.js

# 3. Start the server
cd server && npm start
```

**Reset and Re-seed:**
```bash
# Option 1: Reset then seed
node scripts/reset.js
node scripts/seed.js

# Option 2: Seed only (automatically clears data first)
node scripts/seed.js
```

## Adding Custom Data

To customize the seed data, edit `scripts/seed.js`:

```javascript
const demoUsers = [
  {
    name: "Your Name",
    email: "your@email.com",
    phone: "+1234567890",
    password: "yourpassword",
    initialBalance: 1000.00
  }
  // Add more users...
];
```

## Security Note

⚠️ **Important:** These scripts are for development only. The demo passwords are not hashed. In production:
- Use bcrypt to hash passwords
- Never seed production databases with demo data
- Use strong, unique passwords
- Rotate credentials regularly
