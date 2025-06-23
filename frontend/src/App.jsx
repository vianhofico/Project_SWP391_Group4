import {Routes, Route, Navigate} from "react-router-dom";
import {Dashboard, Auth, User} from "@/layouts";
import UserDetail from "@/pages/dashboard/userDetail.jsx";
import CoursePage from "@/pages/user/course-page/course-page";
import CourseDetailPage from "@/pages/user/course-page/course-detail-page/course-detail-page";



function App() {
    return (
        <Routes>
            <Route path="/dashboard/*" element={<Dashboard/>}/>
            <Route path="/auth/*" element={<Auth/>}/>
            <Route path="/user/*" element={<User/>}/>
            <Route path="/test" element={<CoursePage/>}/>
            <Route path="/test2" element={<CourseDetailPage/>}/>
            <Route path="*" element={<Navigate to="/dashboard/home" replace/>}/>
        </Routes>
    );
}

export default App;
