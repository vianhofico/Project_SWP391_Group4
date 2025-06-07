import {Routes, Route, Navigate} from "react-router-dom";
import {Dashboard, Auth, User} from "@/layouts";
import UserDetail from "@/pages/dashboard/userDetail.jsx";

function App() {
    return (
        <Routes>
            <Route path="/dashboard/*" element={<Dashboard/>}/>
            <Route path="/auth/*" element={<Auth/>}/>
            <Route path="/user/*" element={<User/>}/>
            <Route path="*" element={<Navigate to="/dashboard/home" replace/>}/>
        </Routes>
    );
}

export default App;
