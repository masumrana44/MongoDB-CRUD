const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Username: recap-curd-mongodb
// password: D4nTuBzSLtkdBM4c

const uri =
  "mongodb+srv://recap-curd-mongodb:D4nTuBzSLtkdBM4c@cluster0.w9y9xep.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const productCollection = client.db("recapMongoCrud").collection("product");

    // Get all product from mongodb database
    app.get("/addproduct", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // get specific product from monogdb database
    app.get("/updateproudct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // Product updating  to Mongodb database
    app.put("/updateproudct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const product = req.body;
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          productName: product.productName,
          productPhotoUrl: product.productPhotoUrl,
          productPrice: product.productPrice,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    // insert a product to Mongodb Database
    app.post("/addproduct", async (req, res) => {
      const prodduct = req.body;
      const result = await productCollection.insertOne(prodduct);
      res.send(result);
    });

    // Delete specific product from MongoDb database
    app.delete("/deleteproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run();

app.get("/", (req, res) => {
  res.send("Recap CRUD-server is Running");
});

app.listen(port, () => {
  console.log(`Recap CRUD-server is Running on port ${port}`);
});
