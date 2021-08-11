const db = require("../models");
const Account = db.account;
const Op = db.Sequelize.Op;
const fs = require("fs");
var path = require("path");

// Create and Save a new Account
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Account
  const account = {
    id: req.body.id,
    balance: req.body.balance,
    credit: req.body.credit,
    picture: req.body.picture,
    name_first: req.body.name_first,
    name_last: req.body.name_last,
    employer: req.body.employer,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    comments: req.body.comments,
    created: req.body.created,
    tags: req.body.tags,
  };

  // Save Account in the database
  Account.create(account)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the account.",
      });
    });
};

// Retrieve all Accounts from the database.
exports.findAll = (req, res) => {
  const name_first = req.query.firstName;
  let condition = name_first
    ? { name_first: { [Op.like]: `%${name_first}%` } }
    : null;
  Account.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving accounts.",
      });
    });
};

// Find a single Account with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log("id", id);

  Account.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Account with id=" + id,
      });
    });
};

// Update a Account by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Account.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Account with id=" + id,
      });
    });
};

// Delete a Account with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Account.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Account with id=${id}. Maybe Account was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Account with id=" + id,
      });
    });
};

// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
  Account.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Account were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all accounts.",
      });
    });
};

//Reset all values to use dummy values from accounts.json file
exports.reset = (req, res) => {
  // Methods to display directory
  console.log("__dirname:    ", __dirname);
  console.log("process.cwd() : ", process.cwd());
  console.log("./ : ", path.resolve("./"));
  console.log("filename: ", __filename);

  console.log("path.resolve ./");
  fs.readdir(path.resolve("./"), (err, files) => {
    files.forEach((file) => {
      console.log("path.resolve ./", file);
    });
  });

  console.log("path.resolve ../");
  fs.readdir(path.resolve("../"), (err, files) => {
    files.forEach((file) => {
      console.log("path.resolve ../", file);
    });
  });

  console.log("../");
  fs.readdir("../", (err, files) => {
    files.forEach((file) => {
      console.log("../", file);
    });
  });

  console.log("./");
  fs.readdir("./", (err, files) => {
    files.forEach((file) => {
      console.log("./", file);
    });
  });

  Account.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      console.log(`${nums} were deleted`);
      let accountFile = fs.readFile(
        path.resolve("./accounts.json"),
        (err, data) => {
          if (err) throw err;
          let accounts = JSON.parse(data);
          Account.bulkCreate(accounts)
            .then(() => {
              res.status(200).send({ message: "Successfully reset account" });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Unable to bulk upload accounts.",
              });
            });
        }
      );
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all accounts.",
      });
    });
};
