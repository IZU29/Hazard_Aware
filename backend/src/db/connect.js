const mongoose = require('mongoose');

const connectDB = async (url) => {
  try {
    const conn = await mongoose.connect(url);
    
    console.log(`\x1b[32m%s\x1b[0m`, `✔ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✖ MongoDB Connection Error: ${error.message}`);
    // Exit the backend process entirely if the database connection fails
    process.exit(1); 
  }
};

module.exports = connectDB;