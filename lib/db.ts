import mongoose from "mongoose"

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}
