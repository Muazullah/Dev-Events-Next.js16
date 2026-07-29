const { MongoClient } = require("mongodb");

const uri =
    "mongodb://muazullah3_db_user:MUAZkhan1234@ac-ekv6f5z-shard-00-00.57r17yy.mongodb.net:27017,ac-ekv6f5z-shard-00-01.57r17yy.mongodb.net:27017,ac-ekv6f5z-shard-00-02.57r17yy.mongodb.net:27017/?ssl=true&replicaSet=atlas-8ift8o-shard-0&authSource=admin&appName=Cluster0";

async function run() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected successfully!");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();