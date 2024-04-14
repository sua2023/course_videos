const moment = require("moment");
const conn = require("../../db/connect");

const dateTime = moment().format("YYYY-MM-DD: H:M:S");
const createProduct = (req, res) => {
  const { name, unit, price, amount, user_id, category_id } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ status: 400, message: "Product is required" });
  }
  const sql = "SELECT name from product where name =?";
  conn.query(sql, [name], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Internal server error" });
    }
    if (result?.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Product aready exists" });
    }
    const sql =
      "INSERT INTO product (name,unit,price,amount,user_id,category_id, created_at, updated_at) values(?,?,?,?,?,?,?,?)";

    conn.query(
      sql,
      [name, unit, price, amount, user_id, category_id, dateTime, dateTime],
      (err, result) => {
        if (err) throw err;
        conn.query(
          "SELECt * FROM product where id =?",
          [result.insertId],
          (err, row) => {
            if (err) {
              return res
                .status(400)
                .json({ status: 400, message: "Internal server error" });
            }

            return res.status(200).json({
              status: 200,
              message: "Create product success",
              data: row[0],
            });
          }
        );
      }
    );
  });
};

const getProducts = (req, res) => {
  const sql =
    "SELECT product.*,users.username, users.email, category.name as category FROM product INNER JOIN users ON product.user_id = users.id INNER JOIN category ON product.category_id=category.id ORDER BY product.created_at DESC";
  conn.query(sql, (err, result) => {
    if (err) throw err;
    return res.status(200).json({
      status: 200,
      total: result?.length,
      data: result,
    });
  });
};

const getByProduct = (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT product.*,users.username, users.email, category.name as category FROM product INNER JOIN users ON product.user_id = users.id INNER JOIN category ON product.category_id=category.id where product.id=?";
  conn.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.status(200).json({
      status: 200,
      total: result?.length,
      data: result,
    });
  });
};

const deleteProduct = (req, res) => {
  const id = req.body.id;

  conn.query("DELETE FROM `product` WHERE id=?", [id], (err, result) => {
    if (err) throw err;

    return res.status(201).json({ status: 201, message: "Deleted" });
  });
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, unit, price, amount, user_id, category_id } = req.body;

  const sql =
    "UPDATE product SET name=?,unit=?,price=?,amount=?,user_id=?,category_id=?, updated_at =? where id=?";
  conn.query(
    sql,
    [name, unit, price, amount, user_id, category_id, dateTime, id],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Internal server error" });
      }

      conn.query("SELECt * FROM product where id =?", [id], (err, row) => {
        if (err) {
          return res
            .status(400)
            .json({ status: 400, message: "Internal server error" });
        }

        return res.status(200).json({
          status: 200,
          message: "Update product success",
          data: row[0],
        });
      });
    }
  );
};
module.exports = {
  createProduct,
  getProducts,
  getByProduct,
  deleteProduct,
  updateProduct,
};
