const express = require("express");
const cors = require("cors");
const { ObjectId, MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://sakibuddin831:nwlyZ3zg8wiyvkMw@cluster0.hqdjzcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    const userDB = client.db("userDB");
    const booksDB = client.db("booksDB");

    const userCollection = userDB.collection("userCollection");
    const booksCollection = booksDB.collection("booksCollection");
    // users
    app.post("/user", async (req, res) => {
      try {
        const user = req.body;
        const existingUser = await userCollection.findOne({
          email: user.email,
        });

        if (existingUser) {
          return res.send({
            status: "success",
            message: "Login success",
          });
        } else {
          // User does not exist, proceed to insert
          const result = await userCollection.insertOne(user);
          console.log(result);
          res
            .status(201)
            .send({ message: "User inserted", userId: result.insertedId });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error inserting user" });
      }
    });

    app.get("/user/get/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        console.log(user);

        if (!user) {
          res.status(404).send({ message: "User not found" });
        } else {
          res.status(200).send(user);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching user" });
      }
    });

    app.get("/user/:authInfo", async (req, res) => {
      try {
        const authInfo = req.params.authInfo;
        console.log(authInfo);
        const user = await userCollection.findOne({
          email: authInfo,
        });
        console.log(user);

        if (!user) {
          res.status(404).send({ message: "User not found" });
        } else {
          res.status(200).send(user);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching user" });
      }
    });

    app.patch("/user/:id", async (req, res) => {
      try {
        const userId = req.params.id;
        const updateData = req.body;

        if (!ObjectId.isValid(userId)) {
          return res.status(400).send({ message: "Invalid book ID format" });
        }

        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "user not found" });
        }

        res.status(200).send({ message: "user updated successfully" });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Error updating user" });
      }
    });

    // app.get("/user/:id", async (req, res) => {
    //   try {
    //     // const id = decodeURIComponent(req.params.id);
    //     const id = req.params.id;
    //     console.log(id);

    //     // const user = await userCollection.findOne({
    //     //   $or: [{ email: id }, { photoURL: id }]
    //     // });
    //     // console.log(user)
    //     const user = await userCollection.findOne({
    //       email: id,
    //     });

    //     if (!user) {
    //       res.status(404).send({ message: "User not found" });
    //     } else {
    //       res.status(200).send(user);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Error fetching user" });
    //   }
    // });

    // app.get("/user/:id", async (req, res) => {
    //   try {
    //     const id = req.params.id;
    //     console.log(id)
    //     const user = await userCollection.findOne({
    //             email: id, // Assuming email is the field in your user document
    //           });

    //     if (!user) {
    //       res.status(404).send({ message: "User not found" });
    //     } else {
    //       res.status(200).send(user);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Error fetching user" });
    //   }
    // });

    // app.get("user/:id", async (req, res) => {
    //   try {
    //     const bookId = req.params.id;
    //     const book = await booksCollection.findOne({
    //       _id: new ObjectId(bookId),
    //     });

    //     if (!book) {
    //       res.status(404).send({ message: "Book not found" });
    //     } else {
    //       res.status(200).send(book);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Error fetching book" });
    //   }
    // });

    // app.get("/user/:id", async (req, res) => {
    //   try {
    //     const id = req.params.id; // This will hold the email address
    //     const user = await userCollection.findOne({
    //       email: id, // Assuming email is the field in your user document
    //     });

    //     if (!user) {
    //       res.status(404).send({ message: "User not found" });
    //     } else {
    //       res.status(200).send(user);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Error fetching user" });
    //   }
    // });
    // app.post("/user", async (req, res) => {
    //   try {
    //     const user = req.body;

    //     const isUserExist = await userCollection.findOne({
    //       $or: [{ email: user?.email }, { photoURL: user?.photoURL }],
    //     });
    //     if (isUserExist?._id) {
    //       return res.send({
    //         status: "success",
    //         message: "Login success",
    //       });
    //     }
    //     const result = await userCollection.insertOne(user);

    //     res
    //       .status(201)
    //       .send({ message: "User inserted", userId: result.insertedId });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Error inserting user" });
    //   }
    // });

    // books
    app.post("/books", async (req, res) => {
      try {
        const book = req.body;
        const result = await booksCollection.insertOne(book);
        res
          .status(201)
          .send({ message: "Book inserted", bookId: result.insertedId });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error inserting book" });
      }
    });

    // GET route to fetch all books
    app.get("/books", async (req, res) => {
      try {
        const books = await booksCollection.find().toArray();
        res.status(200).send(books);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching books" });
      }
    });

    app.patch("/books/:id", async (req, res) => {
      try {
        const bookId = req.params.id;
        const updateData = req.body;

        if (!ObjectId.isValid(bookId)) {
          return res.status(400).send({ message: "Invalid book ID format" });
        }

        const result = await booksCollection.updateOne(
          { _id: new ObjectId(bookId) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Book not found" });
        }

        res.status(200).send({ message: "Book updated successfully" });
      } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send({ message: "Error updating book" });
      }
    });

    app.get("/books/:id", async (req, res) => {
      try {
        const bookId = req.params.id;
        const book = await booksCollection.findOne({
          _id: new ObjectId(bookId),
        });

        if (!book) {
          res.status(404).send({ message: "Book not found" });
        } else {
          res.status(200).send(book);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching book" });
      }
    });

   

    app.delete("/books/:id", async (req, res) => {
      try {
        const bookId = req.params.id;

        if (!ObjectId.isValid(bookId)) {
          return res.status(400).send({ message: "Invalid book ID format" });
        }

        const result = await booksCollection.deleteOne({
          _id: new ObjectId(bookId),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Book not found" });
        }

        res.status(200).send({ message: "Book deleted successfully" });
      } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send({ message: "Error deleting book" });
      }
    });

    // categories
    app.get("/categories", async (req, res) => {
      try {
        const categories = await booksCollection.find().toArray();
        res.status(200).send(categories);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching categories" });
      }
    });

    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Uncomment this line if you want to close the connection after starting the server
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
