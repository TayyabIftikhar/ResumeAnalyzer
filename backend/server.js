import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';

dotenv.config();
connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

