import { Route, Routes } from "react-router-dom";
import Home from "../dashboard/products";
import Users from "../dashboard/users";
import Category from "../dashboard/category";
import Order from "../dashboard/order";

const MainRoutes = () => {
    return (
      <>
        <Routes>
          <Route path="/order" element={<Order />} />
          <Route path="/products" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </>
    );
};
export default MainRoutes;
