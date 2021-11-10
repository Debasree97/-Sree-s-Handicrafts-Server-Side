const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Conntection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.17stq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("Sree'sHandicrafts");
        const productCollection = database.collection("productsList");
        
        // get: all products
        app.get("/allproduct", async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const allProducts = await cursor.toArray();
            const homeProducts = allProducts.slice(3,9);
            console.log(homeProducts);
            res.send({allProducts,homeProducts});
        })

        // get: few products
        app.get("/homeproduct", async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
           const homeProducts = await cursor
              .limit(6)
              .toArray();
            res.send(homeProducts);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("running");
});

app.listen(port, () => {
    console.log("running from port: ", port);
})