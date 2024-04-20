const moment = require("moment");
const conn = require("../../db/connect");

const dateTime = moment().format("YYYY-MM-DD: H:M:S");

const addOrder = (req, res) => {
  const orderNo = (Math.floor(Math.random() * 900000) + 100000).toString();
  const { userId, body } = req.body;

  const sql =
    "INSERT INTO `order`(order_no,created_at,created_by) values(?,?,?)";
  conn.query(sql, [orderNo, dateTime, userId], async (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Internal server error" });
    }
    try {
      for (let i = 0; i < body.length; i++) {
        await insertOrderDetail(body[i], result.insertId);
      }
      res.status(200).json({
        status: 200,
        message: "Order and details inserted successfully",
      });
    } catch (error) {
      console.error("Error inserting order detail:", error);
    }
  });
};

async function insertOrderDetail(body, id) {
<<<<<<< HEAD
=======
 
>>>>>>> f2e526c6e855b099ca89e7dd8cc59b2696c31d05
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO order_detail(pro_id,product_name,price,unit,quantity,order_id) VALUES (?,?,?,?,?,?)";
    conn.query(
      sql,
      [body.id, body.name, body.price, body.unit, body.quantity, id],
      async (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
          await updateProductQuantity(body.id, body.quantity);
        }
      }
    );
  });
}

async function updateProductQuantity(id, quantity) {
  const approv = await new Promise((resolve, reject) => {
    conn.query("SELECT * FROM product WHERE id = ?", [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  if (approv.length > 0) {
    const data = approv[0];
    const newQuantity = parseInt(data.amount) - parseInt(quantity);

    await new Promise((resolve, reject) => {
      conn.query(
        "UPDATE product SET amount = ? WHERE id = ?",
        [newQuantity, data.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });
  }
}

module.exports = { addOrder };
