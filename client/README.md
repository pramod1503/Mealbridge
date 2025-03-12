# MealBridge\n\nA food donation platform connecting donors with recipients.

## Environment Setup

For development:
1. Create a `.env` file in the client directory
2. Set the API URL:
   ```
   # For local development
   VITE_API_URL=http://localhost:5000
   
   # For production
   VITE_API_URL=https://mealbridge-1.onrender.com
   ```

The production environment will automatically use the settings from `.env.production`.
