import { Route, Routes } from "react-router-dom";
import Home from "../dashboard/products";
import Users from "../dashboard/users";
import Category from "../dashboard/category";
import Order from "../dashboard/order";
import Report from "../dashboard/report";
import ReportBill from "../dashboard/report/ReportBill";

const MainRoutes = () => {
    return (
      <>
        <Routes>
          <Route path="/order" element={<Order />} />
          <Route path="/products" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/category" element={<Category />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report/:id" element={<ReportBill />} />
        </Routes>
      </>
    );
};
export default MainRoutes;
