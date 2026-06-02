const mongoose = require("mongoose");
const dns = require("dns")


dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,  
      socketTimeoutMS:          45000, 
    });    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }     
};
 
module.exports = connectDB;