const express = require("express");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb").ObjectId;
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middle Wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@randomdb.rfcve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("connected to Database");
    const database = client.db("genius-car-mechanics");
    const servicesCollection = database.collection("services");

    // Get API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();

      res.send(services);
    });

    // Get Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);

      res.json(service);
    });

    // Post API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);

      console.log(result);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius Car Mechanics Node Server Successfully.");
});

app.listen(port, () => {
  console.log(`Genius Car app listening at http://localhost:${port}`);
});
