import { Route, Routes } from "react-router-dom";
import Home from "../dashboard/products";
import Users from "../dashboard/users";

const MainRoutes = () => {
    return(
        <>
        <Routes>
            <Route path="/products" element={<Home/>}/>
            <Route path="/users" element={<Users/>}/>
        </Routes>
        </>
    )
};
export default MainRoutes;
