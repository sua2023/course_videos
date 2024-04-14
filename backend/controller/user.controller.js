const conn = require("./../db/connect");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { isValidationEmail } = require("../help/validation");

const createUser = (req, res) => {
  const { firstname, lastname, username, email, password, address } = req.body;
  const dateTime = moment().format("YYYY-MM-DD: H:M:S");
  if (!username && !email) {
    return res
      .status(400)
      .json({ status: 400, message: "Username or Email required" });
  }
  if (!isValidationEmail(email)) {
    return res.status(400).json({ status: 400, message: "Email invalid" });
  }
  conn.query(
    "SELECT  username,email FROM users WHERE username = ? or email=?",
    [username, email],
    (err, results) => {
      if (results?.length > 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Username or Email exists" });
      }
      bcrypt.hash(password, 10, (err, isHasPassword) => {
        if (err) {
          res.status(400).json({ status: 500, message: "has password failed" });
        }
        conn.query(
          "insert into users (`firstname`, `lastname`, `username`, `email`, `password`, `address`,created_at) values(?,?,?,?,?,?,?)",
          [
            firstname,
            lastname,
            username,
            email,
            isHasPassword,
            address,
            dateTime,
          ],
          (err, result) => {
            if (err) throw err;
            return res.status(200).json({
              status: 200,
              message: "create user success",
              data: result,
            });
          }
        );
      });
    }
  );
};

const getUsers = (req, res) => {
  conn.query(
    "select * from users  ORDER BY created_at DESC",
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      const total = results?.length;
      return res.json({ total: total, data: results });
    }
  );
};

const getUserById = (req, res) => {
  const id = req.params.id;
  conn.query("select * from users where id=?", [id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    return res.json({ data: results });
  });
};

const updateUser = (req, res) => {
  const dateTime = moment().format("YYYY-MM-DD: H:M:S");
  const id = req.params.id;
  const { firstname, lastname, username, address } = req.body;
  const sql =
    "UPDATE `users` SET `firstname`=?,`lastname`=?,`username`=?,`address`=?, updated_at=? WHERE id= ?";
  conn.query(
    sql,
    [firstname, lastname, username, address, dateTime, id],
    (err, result) => {
      if (err) throw err;
      return res
        .status(201)
        .json({ status: 201, message: "Update user success" });
    }
  );
};

const deleteUser = (req, res) => {
  const id = req.body.id;

  conn.query("DELETE FROM `users` WHERE id=?", [id], (err, result) => {
    if (err) throw err;

    return res.status(201).json({ status: 201, message: "Deleted" });
  });
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
