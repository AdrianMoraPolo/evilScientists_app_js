/* eslint-disable no-underscore-dangle */
const express = require("express");
const jwt = require("jsonwebtoken");
const mongo = require("mongodb");
const assert = require("assert");

const router = express.Router();
const md5 = require("md5");
// Connection URL
const mongoUrl = "mongodb://localhost:27017";
// Database Name
const mongoDBName = "angelmongodb";

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

const secret = "mysecret";

// para interactuar con la base de datos
router.post("/auth", (req, res) => {
  mongo.MongoClient.connect(mongoUrl, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(mongoDBName);

    const query = db.collection("users").find({
      username: req.body.username,
      password: md5(req.body.password)
    });

    query.toArray().then(documents => {
      if (documents.length > 0) {
        const token = jwt.sign(
          {
            _id: documents[0]._id,
            username: documents[0].username,
            isAdmin: !!documents[0].isAdmin
          },
          secret
          // {
          //     expiresIn: 3600
          // }
        );
        res.send(token);
      } else {
        res.status(400).send("Invalid credentials");
      }
    });

    client.close();
  });
});

router.get("/users", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  // try verifica lo que hacemos, si lo hemos hecho "mal" lanza el error

  try {
    const payload = jwt.verify(token, secret);

    if (!payload.isAdmin) {
      mongo.MongoClient.connect(mongoUrl, (_err, client) => {
        const db = client.db(mongoDBName);
        const query = db
          .collection("users")
          .find({}, { projection: { username: 1 } });

        query.toArray().then(documents => {
          res.send(documents);
          console.log(documents);
        });

        client.close();
      });
    } else {
      mongo.MongoClient.connect(mongoUrl, (_err, client) => {
        const db = client.db(mongoDBName);
        const query = db
          .collection("users")
          .find({}, { projection: { username: 1, email: 1, isAdmin: 1 } });

        query.toArray().then(documents => {
          res.send(documents);
          console.log(documents);
        });

        client.close();
      });
    }
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.get("/designs", (req, res) => {
  // const token = req.headers.authorization.replace('Bearer ', '');
  // try verifica lo que hacemos, si lo hemos hecho "mal" lanza el error

  try {
    mongo.MongoClient.connect(mongoUrl, (_err, client) => {
      const db = client.db(mongoDBName);
      const query = db.collection("designs").find(
        {},
        {
          projection: {
            designname: 1,
            proyect: 1,
            version: 1,
            user: 1
          }
        }
      );

      query.toArray().then(documents => {
        res.send(documents);
        console.log(documents);
      });

      client.close();
    });
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.get("/users/:id", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  // try verifica lo que hacemos, si lo hemos hecho "mal" lanza el error
  try {
    const payload = jwt.verify(token, secret);

    if (!payload.isAdmin) {
      console.log("No tienes permisos");
    } else {
      const { id } = req.params;
      mongo.MongoClient.connect(mongoUrl, (_err, client) => {
        const db = client.db(mongoDBName);
        const query = db
          .collection("users")
          .find(
            { _id: mongo.ObjectID(id) },
            { projection: { username: 1, email: 1, isAdmin: 1 } }
          );

        query.toArray().then(documents => {
          res.send(documents[0]);
          console.log(documents);
        });

        client.close();
      });
    }
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.post("/users", (req, res) => {
  // const token = req.headers.authorization.replace('Bearer ', '');

  try {
    // const payload = jwt.verify(token, secret);

    mongo.MongoClient.connect(mongoUrl, (_err, client) => {
      const data = req.body;
      const db = client.db(mongoDBName);
      db.collection("users").insertOne(
        {
          username: data.username,
          password: md5(data.password),
          email: data.email,
          isAdmin: data.isAdmin
        },
        // eslint-disable-next-line no-shadow
        (_err, result) => {
          res.send(result.ops[0]);
        }
      );
      client.close();
    });
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.get("/designs/:id", (req, res) => {
  // const token = req.headers.authorization.replace('Bearer ', '');
  // try verifica lo que hacemos, si lo hemos hecho "mal" lanza el error
  try {
    // const payload = jwt.verify(token, secret);

    const { id } = req.params;
    mongo.MongoClient.connect(mongoUrl, (_err, client) => {
      const db = client.db(mongoDBName);
      const query = db
        .collection("designs")
        .find(
          { _id: mongo.ObjectID(id) },
          { projection: { designname: 1, proyect: 1, version: 1 } }
        );

      query.toArray().then(documents => {
        res.send(documents[0]);
        console.log(documents);
      });

      client.close();
    });
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.post("/users", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, secret);

    if (!payload.isAdmin) {
      console.log("No tienes permisos");
    } else {
      mongo.MongoClient.connect(mongoUrl, (_err, client) => {
        const data = req.body;
        const db = client.db(mongoDBName);
        db.collection("users").insertOne(
          {
            username: data.username,
            password: data.password,
            email: data.email,
            isAdmin: data.isAdmin
          },
          // eslint-disable-next-line no-shadow
          (_err, result) => {
            res.send(result.ops[0]);
          }
        );
        client.close();
      });
    }
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.post("/designs", (req, res) => {
  // const token = req.headers.authorization.replace('Bearer ', '');

  try {
    // const payload = jwt.verify(token, secret);

    mongo.MongoClient.connect(mongoUrl, (_err, client) => {
      const data = req.body;
      const db = client.db(mongoDBName);
      db.collection("designs").insertOne(
        {
          user: mongo.ObjectID(data.user),
          designname: data.designname,
          proyect: data.proyect,
          version: data.version
        },
        // eslint-disable-next-line no-shadow
        (_err, result) => {
          res.send(result.ops[0]);
        }
      );
      client.close();
    });
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.put("/users/:id", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, secret);

    if (!payload.isAdmin) {
      console.log("No tienes permisos");
    } else {
      mongo.MongoClient.connect(mongoUrl, (_err, client) => {
        const { id } = req.params;
        const data = req.body;
        const db = client.db(mongoDBName);

        const set = {};

        if (data.username !== "") {
          set.username = data.username;
        }

        if (data.password !== "") {
          set.password = data.password;
        }

        if (data.email !== "") {
          set.email = data.email;
        }

        if (data.isAdmin !== null) {
          set.isAdmin = data.isAdmin;
        }

        db.collection("users").updateOne(
          { _id: mongo.ObjectID(id) },
          {
            $set: set
          },
          (err, result) => {
            if (err) {
              res.send("No ha podido editarse" + err);
            } else {
              res.send(result);
              console.log("Exito al editar");
            }
          }
        );
        client.close();
      });
    }
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.put("/designs/:id", (req, res) => {
  // const token = req.headers.authorization.replace('Bearer ', '');

  try {
    // const payload = jwt.verify(token, secret);

    mongo.MongoClient.connect(mongoUrl, (_err, client) => {
      const { id } = req.params;
      const data = req.body;
      const db = client.db(mongoDBName);

      const set = {};

      if (data.designname !== "") {
        set.designname = data.designname;
      }

      if (data.version !== "") {
        set.version = data.version;
      }

      if (data.proyect !== "") {
        set.proyect = data.proyect;
      }

      db.collection("designs").updateOne(
        { _id: mongo.ObjectID(id) },
        {
          $set: set
        },
        (err, result) => {
          if (err) {
            console.log("No ha podido editarse");
          } else {
            res.send(result);
            console.log("Exito al editar");
          }
        }
      );
      client.close();
    });
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.delete("/users/:id", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, secret);

    if (!payload.isAdmin) {
      console.log("No tienes permisos");
    } else {
      mongo.MongoClient.connect(mongoUrl, (_err, client) => {
        const { id } = req.params;
        const db = client.db(mongoDBName);
        db.collection("users").deleteOne({ _id: mongo.ObjectID(id) }, () => {
          res.send();
        });
      });
    }
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

router.delete("/designs/:id", (req, res) => {
  // const token = req.headers.authorization.replace('Bearer ', '');

  try {
    // const payload = jwt.verify(token, secret);

    mongo.MongoClient.connect(mongoUrl, (_err, client) => {
      const { id } = req.params;
      const db = client.db(mongoDBName);
      db.collection("designs").deleteOne({ _id: mongo.ObjectID(id) }, () => {
        res.send();
      });
    });
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

module.exports = router;
