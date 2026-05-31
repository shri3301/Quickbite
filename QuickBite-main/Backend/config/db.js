import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_DBurl;
    const dbName = process.env.MONGO_DB_NAME;
    const options = dbName ? { dbName } : {};

    await mongoose.connect(uri, options);
    console.log("DB Connected:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("DB connection failed:", error.message || error);
    throw error;
  }
};