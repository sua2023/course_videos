const moment = require("moment");
const conn = require("../../db/connect");

const dateTime = moment().format("YYYY-MM-DD: H:M:S");

const addOrder = (req, res) => {
  const orderNo = Math.random() * 10;
  const { userId, proId, proName, unit, price, quantity, created_at } =
    req.body;
  const sql = "select * from products where id=?";
  conn.query(sql, [proId], (err, result) => {
    if (result?.length > 0) {
      const sql =
        "INSERT INTO order(order_no,created_at,created_by) value(?,?,?)";
      conn.query(sql, [orderNo, dateTime, userId], (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ status: 400, message: "Internal server error" });
        }
        const sql =
          "INSERT INTO order_detail(pro_id,product_name,price,unit,quantity,order_id) value(?,?,?,?,?,?)";

        conn.query(
          sql,
          [proId, proName, price, unit, quantity, result.insertId],
          (err, row) => {
            if (err) {
              return res
                .status(400)
                .json({ status: 400, message: "Internal server error" });
            }
            return res.status(200).json({
              status: 200,
              message: "Create order success",
            });
          }
        );
      });
    }
  });
};

module.exports = { addOrder };
