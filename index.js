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
    const reviewCollection = database.collection("reviewsList");
    const adminCollection = database.collection("adminList");

    // get: all products
    app.get("/allproduct", async (req, res) => {
      const cursor = productCollection.find({});
      const allProducts = await cursor.toArray();
      const homeProducts = allProducts.slice(1, 7);
      res.send({ allProducts, homeProducts });
    });

    // get: single products
    app.get("/orderproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orderProduct = await productCollection.findOne(query);
      res.send(orderProduct);
    });

    // post: order information
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // get: orders
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // delete: order
    app.delete("/delete/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    // post: review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // get: review
    app.get("/homereview", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    });

    // post: add product
    app.post("/addproduct", async (req, res) => {
      const addedProduct = req.body;
      const result = await productCollection.insertOne(addedProduct);
      res.json(result);
    });

    // get: products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    // delete: product
    app.delete("/deleteproduct/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // post: admin
    app.post("/addadmin", async (req, res) => {
      const admin = req.body;
      const result = await adminCollection.insertOne(admin);
      res.json(result);
    });

    // get: admin
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      let isAdmin = false;
      const admin = await adminCollection.findOne(query);
      if (admin?.email) {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // update: Status
    app.put("/status", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { id: user.id};
      const updateDoc = { $set: { status: "Shipped" } };
      const result = await orderCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.json(result);
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
