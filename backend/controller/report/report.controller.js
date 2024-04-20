const moment = require("moment");
const conn = require("../../db/connect");

const getReports = (req, res) => {
  const sql =
    "SELECT `order`.*, username,email FROM `order` JOIN  users on `order`.`created_by` = users.id";

  conn.query(sql, (err, result) => {
    if (err) throw err;
    return res.status(200).json({
      status: 200,
      total: result?.length,
      data: result,
    });
  });
};

const getByReport = (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT order_detail.*, `order`.`order_no`, `order`.created_at,username,email FROM `order`JOIN order_detail ON order_detail.order_id = `order`.id JOIN `users` ON `order`.`created_by` = `users`.id where order_id=?";
  conn.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.status(200).json({
      status: 200,
      total: result?.length,
      data: result,
    });
  });
};

module.exports = { getByReport, getReports };
