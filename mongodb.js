const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unuble to connect to database!");
    }

    const db = client.db(databaseName);

    db.collection("users").insertOne({
      name: "Artur",
      age: 34,
    });
  }
);
