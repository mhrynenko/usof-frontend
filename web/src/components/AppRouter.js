import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"
import { Context } from "../index";
import { authRoutes, publicRoutes } from "../routes";

const AppRouter = () => {
    const {user} = useContext(Context);
    
    return (
        <Routes>
            {user.isAuth === true && authRoutes.map(({path, Component}) => 
                <Route key={path} path={path} /*element={<Component/>}*/ />
            )},

            {publicRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} />
            )}

            {/*  <Route path='*' element={<Navigate to={SHOP_ROUTE}/>} /> */}
        </Routes>
    );
}

export default AppRouter;