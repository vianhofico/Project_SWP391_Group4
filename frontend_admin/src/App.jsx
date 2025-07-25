import {Routes, Route, Navigate} from "react-router-dom";
import {Dashboard, Auth, User} from "@/layouts";
import ScrollToTop from "@/ScrollToTop.jsx";
import PrivateRoute from "@/configs/PrivateRoute.jsx";

function App() {
    return (
        <>
            <ScrollToTop/>
            <Routes>
                <Route path="/auth/*" element={<Auth/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route path="/dashboard/*" element={<Dashboard/>}/>
                    <Route path="*" element={<Navigate to="/dashboard/user/learner" replace/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
