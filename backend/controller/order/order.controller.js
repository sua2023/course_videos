const moment = require("moment");
const conn = require("../../db/connect");

const dateTime = moment().format("YYYY-MM-DD: H:M:S");

const addOrder = (req, res) => {
  const orderNo = (Math.floor(Math.random() * 900000) + 100000).toString();
  const { userId, body } = req.body;

  const sql =
    "INSERT INTO `order`(order_no,created_at,created_by) values(?,?,?)";
  conn.query(sql, [orderNo, dateTime, userId], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Internal server error" });
    }

    const insertOrderDetail = async () => {
      for (let i = 0; i < body.length; i++) {
        const sql =
          "INSERT INTO order_detail(pro_id,product_name,price,unit,quantity,order_id) value(?,?,?,?,?,?)";
        try {
          await new Promise((resolve, reject) => {
            conn.query(
              sql,
              [
                body[i].id,
                body[i].name,
                body[i].price,
                body[i].unit,
                body[i].quantity,
                result.insertId,
              ],
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
        } catch (error) {
          return error
        }
      }
    };
    insertOrderDetail();
  });
};

// const addOrder = (req, res) => {
//   const orderNo = (Math.floor(Math.random() * 900000) + 100000).toString();
//   const { userId, body } = req.body;

//   const sql =
//     "INSERT INTO `order`(order_no,created_at,created_by) values(?,?,?)";
//   conn.query(sql, [orderNo, dateTime, userId], (err, result) => {
//     if (err) {
//       return res
//         .status(400)
//         .json({ status: 400, message: "Internal server error" });
//     }

//     const insertOrderDetail = async () => {
//       for (let i = 0; i < body.length; i++) {
//         const sql =
//           "INSERT INTO order_detail(pro_id,product_name,price,unit,quantity,order_id) value(?,?,?,?,?,?)";
//         try {
//           await new Promise((resolve, reject) => {
//             conn.query(
//               sql,
//               [
//                 body[i].id,
//                 body[i].name,
//                 body[i].price,
//                 body[i].unit,
//                 body[i].quantity,
//                 result.insertId,
//               ],
//               (err, row) => {
//                 if (err) {
//                   reject(err);
//                 } else {
//                   resolve();
//                 }
//               }
//             );
//           });
//         } catch (err) {
//           return res
//             .status(400)
//             .json({ status: 400, message: "Internal server error" });
//         }
//       }
//       return res.status(200).json({
//         status: 200,
//         message: "Create order success",
//       });
//     };

//     insertOrderDetail();
//   });
// };

module.exports = { addOrder };
