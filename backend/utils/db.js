const mongoose = require("mongoose");

let conn = null;

async function connectDB() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected 🚀");
  }
  return conn;
}

module.exports = connectDB;

