const express = require("express");
const router = express.Router();
const authRoute = require("./../controller/auth");
const userRoute = require("./../controller/user.controller");
const category = require("./../controller/category/category.controller");
const product = require("./../controller/product/product.controller");
const order = require("./../controller/order/order.controller");
const report = require("./../controller/report/report.controller");

const { authenticateToken } = require("../middleware/jwtToken");

router.post("/auth", authRoute.authLogin);
router.post("/user", authenticateToken, userRoute.createUser);
router.get("/user", authenticateToken, userRoute.getUsers);
router.get("/user/:id", authenticateToken, userRoute.getUserById);
router.put("/user/:id", authenticateToken, userRoute.updateUser);
router.delete("/user", authenticateToken, userRoute.deleteUser);

// route category

router.post("/category", authenticateToken, category.createCategory);
router.get("/category", authenticateToken, category.getCategory);
router.put("/category/:id", authenticateToken, category.updateCategory);
router.delete("/category", authenticateToken, category.deleteCategory);

// route product
router.post("/product", authenticateToken, product.createProduct);
router.get("/product", authenticateToken, product.getProducts);
router.get("/product/:id", authenticateToken, product.getByProduct);
router.delete("/product", authenticateToken, product.deleteProduct);
router.put("/product/:id", authenticateToken, product.updateProduct);
router.post("/product/addStock", authenticateToken, product.addStock);

// report
router.get("/report", authenticateToken, report.getReports);
router.get("/report/:id", authenticateToken, report.getByReport);

// order
router.post("/order",authenticateToken,order.addOrder)
module.exports = router;
