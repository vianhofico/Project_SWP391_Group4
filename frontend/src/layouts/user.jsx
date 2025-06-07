import { Routes, Route } from "react-router-dom";
import {
    ChartPieIcon,
    UserIcon,
    UserPlusIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";

export function User() {
    const navbarRoutes = [
        {
            name: "user",
            path: "/user/forum",
            icon: ChartPieIcon,
        },
        {
            name: "detailPost",
            path: "/user/detailPost",
            icon: ChartPieIcon,
        },

    ];

    return (
        <div className="relative min-h-screen w-full">
            <Routes>
                {routes.map(
                    ({ layout, pages }) =>
                        layout === "user" &&
                        pages.map(({ path, element }) => (
                            <Route exact path={path} element={element} />
                        ))
                )}
            </Routes>
        </div>
    );
}

User.displayName = "/src/layout/User.jsx";

export default User;
