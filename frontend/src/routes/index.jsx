import { Route, Routes } from "react-router-dom";
import Home from "../dashboard/products";
import Users from "../dashboard/users";
import Category from "../dashboard/category";

const MainRoutes = () => {
    return(
        <>
        <Routes>
            <Route path="/products" element={<Home/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/category" element={<Category/>}/>
        </Routes>
        </>
    )
};
export default MainRoutes;
