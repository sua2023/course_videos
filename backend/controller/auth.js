const conn = require("./../db/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authLogin = (req, res) => {
  const { username, email, password } = req.body;
  const secrekey = "voeNYEWxB7q9hpEb44ybI1euSio57AlL";
  if (!username && !email) {
    return res
      .status(400)
      .json({ status: 400, message: "Username or Email required" });
  }

  conn.query(
    "SELECT id, username,email, password FROM users WHERE username = ? or email=?",
    [username, email],
    (err, results) => {
      if (!results?.length > 0) {
        return res.status(401).json({ status: 401, message: "Not found user" });
      }

      const user = results[0];
      const newPassword = results[0]?.password;
    
      bcrypt.compare(password, newPassword, (err, isMatch) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
        }
        if (!isMatch) {
          return res
            .status(400)
            .json({ status: 400, message: "Username or password incorrect" });
        }
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          secrekey,
          { expiresIn: "24h" }
        );

        return res
          .status(200)
          .json({ status: 200, message: "Login success", token: token });
      });
    }
  );
};

module.exports = { authLogin };
