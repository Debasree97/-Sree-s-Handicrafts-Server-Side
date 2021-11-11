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
    const orderCollection = database.collection("ordersList");

    // get: all products
    app.get("/allproduct", async (req, res) => {
      const cursor = productCollection.find({});
      const allProducts = await cursor.toArray();
      const homeProducts = allProducts.slice(3, 9);
      res.send({ allProducts, homeProducts });
    });

    // get: single products
    app.get("/orderproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orderProduct = await productCollection.findOne(query);
      res.send(orderProduct);
    });

    // post order information
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // get: my orders
    app.get("/orders", async (req, res) => {
     const cursor = orderCollection.find({});
     const orders = await cursor.toArray();
      res.json(orders);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running ");
});

app.listen(port, () => {
  console.log("running from port: ", port);
});
