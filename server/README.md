# MealBridge Server

Backend API for the MealBridge application, a platform for food donation matching between donors and recipients.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies

```bash
npm install
```

2. Create a .env file in the root directory and add your environment variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mealbridge
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

3. Run the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication Routes

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user & get token
- GET `/api/auth/me` - Get current logged in user
- GET `/api/auth/logout` - Logout user

### Donation Routes

- GET `/api/donations` - Get all donations
- GET `/api/donations/:id` - Get single donation
- POST `/api/donations` - Create a new donation
- PUT `/api/donations/:id` - Update donation
- DELETE `/api/donations/:id` - Delete donation
- PUT `/api/donations/:id/reserve` - Reserve a donation

### User Routes

- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get single user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Built With

- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [JWT](https://jwt.io/) - Auth tokens 