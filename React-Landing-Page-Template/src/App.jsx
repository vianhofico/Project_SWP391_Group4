// import React, {useState, useEffect} from "react";
// import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
// import {Navigation} from "./components/navigation";
// import JsonData from "./data/data.json";
// import CartDetail from "./components/CartDetail";
// import OrderHistory from "./components/OrderHistory";
// import OrderItems from "./components/OrderItems";
// import CheckoutPage from "./components/CheckoutPage";
// import Home from "./components/Home";
// import "./App.css";
// import SignIn from "./components/sign-in";
// import AccountSettings from "./components/AccountSetting";
// import MyCourses from "./components/MyCourse";
// import { AllCourses } from "./components/AllCourses";
// import SignUp from "./components/sign-up";
//
// const App = () => {
//     const [landingPageData, setLandingPageData] = useState({});
//
//     useEffect(() => {
//         setLandingPageData(JsonData);
//     }, []);
//
//     return (
//         <BrowserRouter>
//             <Navigation/>
//             <Routes>
//                 <Route path="/" element={<Home landingPageData={landingPageData}/>}/>
//                 <Route path="/login" element={<SignIn/>}/>
//                 <Route path="/sign-up" element={<SignUp/>}/>
//                 <Route path="/cart" element={<CartDetail/>}/>
//                 <Route path="/confirm-checkout" element={<CheckoutPage/>}/>
//                 <Route path="/order-history" element={<OrderHistory/>}/>
//                 <Route path="/order-items" element={<OrderItems/>}/>
//                 <Route path="/account-settings" element={<AccountSettings/>}/>
//                 <Route path="/my-courses" element={<MyCourses/>}/>
//                 <Route path="/courses" element={<AllCourses/>}/>
//                 <Route path="*" element={<Navigate to="/" replace/>}/>
//             </Routes>
//         </BrowserRouter>
//     );
// };
//
// export default App;


import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/navigation";
import JsonData from "./data/data.json";
import CartDetail from "./components/CartDetail";
import OrderHistory from "./components/OrderHistory";
import OrderItems from "./components/OrderItems";
import CheckoutPage from "./components/CheckoutPage";
import Home from "./components/Home";
import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
import AccountSettings from "./components/AccountSetting";
import MyCourses from "./components/MyCourse";
import { AllCourses } from "./components/AllCourses";
import "./App.css";

const App = () => {
    const [landingPageData, setLandingPageData] = useState({});

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home landingPageData={landingPageData} />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/cart" element={<CartDetail />} />
                <Route path="/confirm-checkout" element={<CheckoutPage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order-items" element={<OrderItems />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/courses" element={<AllCourses />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
