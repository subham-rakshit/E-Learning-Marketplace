import mongoose from 'mongoose'

const connection = {}

const dbConnect = async () => {
  // Check if the database is already connected
  if (connection.isConnected) {
    console.log('Database already connected')
    return mongoose.connection
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '')
    connection.isConnected = db.connections[0].readyState

    console.log('Database connection established successfully')
    return db
  } catch (error) {
    console.log(`Database connection error: ${error}`)
    process.exit(1)
  }
}

export default dbConnect
