# Infinity Bank - Client Application

A modern, secure banking application frontend built with React and Material-UI. This Single Page Application (SPA) provides a user-friendly interface for managing bank accounts, viewing transactions, and transferring money.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Pages](#pages)
- [Components](#components)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Code Quality](#code-quality)
- [Testing](#testing)

## Overview

Infinity Bank is a secure banking platform that allows users to:
- Create and manage bank accounts
- View real-time account balances
- Track transaction history
- Transfer money between accounts
- Secure authentication with JWT tokens

**Code Metrics:**
- Total Lines: ~1,104 (368 JS + 736 CSS)
- React Components: 17
- Pages: 4
- API Endpoints: 7

## Features

- **User Authentication**: Secure login and registration with JWT token-based authentication
- **OTP Verification**: Two-factor authentication via SMS OTP during registration
- **Dashboard**: Real-time balance display and transaction history
- **Money Transfer**: Intuitive money transfer interface with slider controls
- **Responsive Design**: Mobile-first design that works on all devices
- **Material-UI Integration**: Modern, consistent UI with Material Design principles
- **Auto-Authentication Check**: Automatic redirect to dashboard for logged-in users

## Technology Stack

### Core
- **React**: 18.3.1
- **React DOM**: 18.3.1
- **Create React App**: 5.0.1 (build tool)

### UI Framework
- **Material-UI (@mui/material)**: 6.1.7
- **Material-UI Icons**: 6.1.7
- **Emotion (styling)**: ^11.11.0
- **CSS Modules**: Scoped component styling

### HTTP Client
- **Axios**: 1.7.7

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **React Testing Library**: Component testing
- **Jest**: Test runner
- **Web Vitals**: Performance monitoring

## Project Structure

```
client/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   ├── logo192.png        # App icons
│   └── manifest.json      # PWA manifest
│
├── src/
│   ├── pages/             # Page components (routing)
│   │   ├── Home.js        # Landing page
│   │   ├── Login.js       # Login page
│   │   ├── Register.js    # Registration page
│   │   └── Dashboard.js   # User dashboard (protected)
│   │
│   ├── components/        # Reusable UI components
│   │   ├── Header.js      # Navigation header
│   │   ├── Logo.js        # Logo component
│   │   ├── BaseForm.js    # Form wrapper
│   │   ├── Transfer.js    # Money transfer form
│   │   ├── Transaction.js # Transaction list
│   │   ├── TransactionItem.js  # Single transaction
│   │   ├── Balance.js     # Balance display
│   │   └── Button.js      # Custom button
│   │
│   ├── services/          # API integration
│   │   └── api.js         # All API endpoints
│   │
│   ├── styles/            # CSS Modules
│   │   ├── Header.module.css
│   │   ├── Container.module.css
│   │   ├── components.module.css
│   │   ├── TransactionItem.module.css
│   │   └── home.module.css
│   │
│   ├── App.js             # Main app component & routing logic
│   ├── index.js           # React DOM render entry point
│   └── index.css          # Global styles
│
├── .env.example           # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see server README)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd /path/to/Secure-Banking/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development

```bash
# Start development server (port 3000)
npm start
# or
npm run dev
```

### Production Build

```bash
# Create optimized production build
npm run build
```

### Testing

```bash
# Run tests in watch mode
npm test

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Run ESLint checks
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Environment Variables

Create a `.env` file in the client root directory:

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

## Pages

### 1. Home Page (`/`)
- **Component**: `pages/Home.js`
- **Purpose**: Landing page with feature showcase
- **Features**:
  - Auto-redirects authenticated users to dashboard
  - Login and Register CTAs
  - Feature highlights

### 2. Login Page
- **Component**: `pages/Login.js`
- **Purpose**: User authentication
- **Features**:
  - Email/password form
  - JWT token storage in localStorage
  - Auto-redirect on successful login

### 3. Register Page
- **Component**: `pages/Register.js`
- **Purpose**: New user registration
- **Features**:
  - Multi-field form (name, email, phone, password)
  - Password confirmation validation
  - OTP verification modal
  - Initial balance: $100

### 4. Dashboard Page (Protected)
- **Component**: `pages/Dashboard.js`
- **Purpose**: User account management
- **Features**:
  - Real-time balance display
  - Transaction history
  - Money transfer modal
  - Refresh data functionality
  - Logout

## Components

### Layout Components

**Header** (`components/Header.js`)
- App navigation bar
- Material-UI AppBar with gradient
- Logo and navigation buttons

### Form Components

**BaseForm** (`components/BaseForm.js`)
- Reusable form wrapper for login/register
- Handles form state and validation

**Transfer** (`components/Transfer.js`)
- Money transfer interface
- Slider control for amount selection
- Recipient email input
- Balance validation

### Data Display Components

**Transaction** (`components/Transaction.js`)
- Container for transaction list
- Maps through transaction array

**TransactionItem** (`components/TransactionItem.js`)
- Individual transaction display
- Green for deposits, red for transfers
- Amount formatting

**Balance** (`components/Balance.js`)
- Balance display component
- Currency formatting

### UI Components

**Logo** (`components/Logo.js`)
- Application logo display

**Button** (`components/Button.js`)
- Custom button wrapper with consistent styling

## API Integration

All API calls are centralized in `services/api.js`.

### Base Configuration
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

### Endpoints

#### Authentication (Public)

**Register User**
```javascript
register({ name, email, phone, password })
// POST /register
```

**Validate OTP**
```javascript
validateOtp({ formData, otp })
// POST /register/otp_validator
```

**Login**
```javascript
Login({ email, password })
// POST /login
// Returns: { token, user_found }
```

**Check Authentication**
```javascript
CheckAuth()
// GET /
// Validates JWT token from localStorage
```

#### Protected Endpoints (Requires Bearer Token)

**Get Dashboard Data**
```javascript
GetDashboardData()
// GET /dashboard
// Returns: { Balance, Transactions }
```

**Get User Data**
```javascript
GetUserData()
// GET /register
// Returns: { name }
```

**Make Transfer**
```javascript
MakeTransfer({ receiverEmail, amount })
// POST /transfer
```

### Authentication Flow

1. User logs in → receives JWT token
2. Token stored in `localStorage` as "LoginAuth"
3. All protected requests include header:
   ```javascript
   headers: { Authorization: `Bearer ${token}` }
   ```

## Styling

### Approach
The application uses a hybrid styling approach:

1. **Material-UI Theme**: Core UI components and theming
2. **CSS Modules**: Component-scoped styles
3. **Emotion**: CSS-in-JS for dynamic styles

### Theme Configuration

```javascript
// src/App.js
const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },      // Teal
    background: { default: '#e0f7fa' }  // Light cyan
  },
  typography: {
    fontFamily: 'Roboto Mono, monospace'
  }
});
```

### CSS Modules

Each component has its own CSS module for scoped styling:
- `Header.module.css` - Header component styles
- `Container.module.css` - Container layouts
- `components.module.css` - Shared component styles
- `TransactionItem.module.css` - Transaction item styles
- `home.module.css` - Home page styles

### Key Style Features

- **Gradients**: Linear gradients for visual appeal
- **Blur Effects**: Backdrop blur on cards
- **Smooth Transitions**: 0.2-0.3s transitions
- **Custom Scrollbars**: Webkit scrollbar styling
- **Responsive Breakpoints**: 991px, 640px

## Code Quality

### ESLint Configuration

Rules defined in `.eslintrc.json`:
- **Quotes**: Double quotes required
- **Semicolons**: Required
- **Indentation**: 2 spaces
- **Warnings**: Console usage, unused variables

### Prettier Configuration

Settings in `.prettierrc`:
- **Line Width**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Double quotes
- **Trailing Commas**: None
- **Line Endings**: LF

### Running Code Quality Checks

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Testing

### Test Framework
- **Jest**: Test runner
- **React Testing Library**: Component testing

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Files Location
Tests should be placed alongside components:
```
src/
  components/
    Button.js
    Button.test.js
```

## Authentication & Security

### Implemented Security Features

- **JWT Token Authentication**: Secure token-based auth
- **Bearer Token**: Sent in Authorization header
- **Password Validation**: Confirmation during registration
- **OTP Verification**: Two-factor authentication
- **Token Expiration**: 30-minute token lifetime (server-side)

### Security Best Practices

- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Never commit `.env` files
- **Token Storage**: Consider using httpOnly cookies instead of localStorage
- **Input Validation**: Always validate user inputs
- **CORS**: Configure CORS on backend

## State Management

The application uses React's built-in state management:

- **useState**: Component-level state
- **useEffect**: Side effects and API calls
- **localStorage**: Persistent token storage

### Global State
No external state management library (Redux, MobX) is used. State is passed via props and managed locally.

## Navigation

The app uses custom state-based routing instead of React Router:

```javascript
// App.js
const [page, setPage] = useState("home");

// Navigate by changing state
setPage("dashboard");
```

**Available Routes**:
- `"home"` → Home Page
- `"login"` → Login Page
- `"register"` → Register Page
- `"dashboard"` → Dashboard Page (protected)

## Browser Support

The application supports modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Code Splitting**: Via Create React App
- **Lazy Loading**: Can be implemented for routes
- **Build Optimization**: Production builds are minified
- **Bundle Analysis**: Use `npm run build` and analyze

## Troubleshooting

### Common Issues

**API Connection Error**
- Verify backend server is running on port 5000
- Check `REACT_APP_API_URL` in `.env`

**Authentication Fails**
- Clear localStorage: `localStorage.clear()`
- Check JWT token expiration (30 minutes)

**Build Fails**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (v14+)

## Contributing

1. Follow ESLint and Prettier configurations
2. Write tests for new components
3. Use CSS Modules for component styles
4. Keep components small and focused
5. Document complex logic with comments

## License

This project is part of the Secure Banking application.

## Additional Resources

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Create React App Documentation](https://create-react-app.dev/)
- [Axios Documentation](https://axios-http.com/)
