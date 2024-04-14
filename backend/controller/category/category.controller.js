const moment = require("moment");
const conn = require("../../db/connect");

const createCategory = (req, res) => {
  const { name } = req.body;
  const dateTime = moment().format("YYYY-MM-DD: H:m:ss");
  if (!name) {
    return res.json({ message: "Required" });
  }
  conn.query(
    "SELECT name from category where name=?",
    [name],
    (error, result) => {
      if (error) {
        return res
          .status(400)
          .json({ status: 400, message: "Internal server error" });
      }
      if (result.length > 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Cateogry exists" });
      }

      conn.query(
        "INSERT INTO category (name, date) values(?,?)",
        [name, dateTime],
        (err, result) => {
          if (err) throw err;
          return res
            .status(200)
            .json({ status: 200, message: "Create category success" });
        }
      );
    }
  );
};

const getCategory = (req, res) => {
  conn.query("select * from category ORDER BY date DESC", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    const total = results?.length;
    return res.json({ total: total, data: results });
  });
};

const updateCategory = (req, res) => {
  const dateTime = moment().format("YYYY-MM-DD: H:M:S");
  const id = req.params.id;
  const { name } = req.body;
  const sql = "UPDATE `category` SET `name`=? WHERE id= ?";
  conn.query(sql, [name, id], (err, result) => {
    if (err) throw err;
    return res
      .status(200)
      .json({ status: 200, message: "Update user success" });
  });
};

const deleteCategory = (req, res) => {
  const id = req.body.id;
  conn.query("DELETE FROM category where id=?", [id], (err, result) => {
    if (err) throw err;
    return res.status(200).json({ status: 200, message: "Deleted" });
  });
};
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
