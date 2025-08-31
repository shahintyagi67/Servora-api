const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// const connectDB = async () => {
//   try{
//  await mongoose.connect('mongodb://localhost:27017/adminBackend');
//  console.log('Connected');
//   }
//   catch(err){
//   console.log("MONGO Error",err)
//   }
// }

module.exports = connectDB;


