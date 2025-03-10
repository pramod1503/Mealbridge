# MealBridge

MealBridge is a web application that connects food donors with those in need, helping to reduce food waste and support communities.

![MealBridge Logo](client/public/logo.svg)

## Features

- User authentication (login/register) for donors and recipients
- Donation creation and management
- Real-time donation listings
- Detailed donation information
- User dashboard
- Responsive design

## Tech Stack

- **Frontend:**
  - React
  - Vite
  - Styled Components
  - React Router
  - Axios
  - React Toastify

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Cors

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mealbridge.git
cd mealbridge
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create environment variables
```bash
# In the server directory, create a .env file with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# In the client directory, create a .env file with:
VITE_API_URL=http://localhost:5000
```

4. Run the application
```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend development server (from the client directory)
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Thanks to all contributors who have helped shape MealBridge
- Special thanks to the open-source community for the amazing tools and libraries