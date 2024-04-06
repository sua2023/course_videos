const express = require("express");
const app = express();
const port = 5000;
const db = require("./db/connect");
const routes = require("./routes")
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.get("/hello", (req, res) => {
    res.json({ message: "hello world" });
});

app.use("/api", routes)
app.listen(port, () => {
    console.log(`server runing http://localhost:${port}`);
});