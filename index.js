const express = require("express");
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(express.static("public"));
app.use(express.json());

// middale ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.01a84k1.mongodb.net/?retryWrites=true&w=majority`;
console.log(process.env.DB_USER);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
   const taskCollection = client.db('JobTask').collection('addTask')



    app.post('/task', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task)
      res.send(result);
    })

    app.get('/task', async (req, res) => {
      
      const result = await taskCollection.find().toArray()
      res.send(result);
    })

    app.delete('/taskDelete/:id', async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/task/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await taskCollection.findOne(query);
    //   res.send(result);
    // });


    // app.patch("/task/:id", async (req, res) => {
    //   const item = req.body;
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };

    //   const updatedDoc = {
    //     $set: {
    //       title: item.title,
    //       deadline: item.deadline,
    //       description: item.description,
    //       priority: item.priority,
    //     },
    //   };
    //   const result = await taskCollection.updateOne(filter, updatedDoc);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task mangement running");
});

app.listen(port, () => {
  console.log(`Task manegment server is running${port}`);
});