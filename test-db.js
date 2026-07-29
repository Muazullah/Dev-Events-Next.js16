const mongoose = require('mongoose');

const uri = "mongodb+srv://muazullah3_db_user:RbvissQqFOK2UVhK@cluster0.57r17yy.mongodb.net/?appName=Cluster0";

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ DATABASE CONNECTION SUCCESSFUL!");
    
    // Let's also check if we can query the collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Found collections:", collections.map(c => c.name).join(', '));
    
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED:");
    console.error(err);
  }
}

testConnection();
