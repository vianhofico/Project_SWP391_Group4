import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {Profile, Users, Notifications, Posts} from "@/pages/dashboard";
import {SignIn, SignUp} from "@/pages/auth";
import Forum from "/src/pages/user/forum.jsx"
import Reports from "/src/pages/dashboard/reports.jsx"
import DetailPost from "/src/pages/user/detailPost.jsx"
import {ChartPieIcon} from "@heroicons/react/24/solid/index.js";
import UserDetail from "@/pages/dashboard/userDetail.jsx";
import UserTabs from "@/pages/dashboard/userTab.jsx";
import PostTopics from "@/pages/dashboard/postTopics.jsx";
import PostDetail from "@/pages/dashboard/postDetail.jsx";

const icon = {
    className: "w-5 h-5 text-inherit",
};

export const routes = [

    {
        layout: "dashboard",
        pages: [
            {
                icon: <UserCircleIcon {...icon} />,
                name: "profile",
                path: "/profile",
                element: <Profile/>,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: "admin",
                path: "/admins",
                element: <Users/>,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: "learner",
                path: "/learners",
                element: <Users/>,
            },
            {
                icon: <HomeIcon {...icon} />,
                name: "Post",
                path: "/posts",
                element: <Posts/>,
            },
            {
                icon: <HomeIcon {...icon} />,
                name: "Topic of post",
                path: "/postTopics",
                element: <PostTopics/>,
            },
            {
                icon: <InformationCircleIcon {...icon} />,
                name: "report",
                path: "/reports",
                element: <Reports/>,
            },

            {
                icon: <InformationCircleIcon {...icon} />,
                name: "notification",
                path: "/notifications",
                element: <Notifications/>,
            },
            {
                path: "/:role/:userId/:tab",
                element: <UserDetail/>,
                hidden: true,
            },
            {
                path: "/users/:userId/:tab",
                element: <UserTabs/>,
                hidden: true,
            },
            {
                path: "/posts/:postId",
                element: <PostDetail/>,
                hidden: true,
            },
        ],
    },
    {
        title: "auth pages",
        layout: "auth",
        pages: [
            {
                icon: <ServerStackIcon {...icon} />,
                name: "sign in",
                path: "/sign-in",
                element: <SignIn/>,
            },
            {
                icon: <RectangleStackIcon {...icon} />,
                name: "sign up",
                path: "/sign-up",
                element: <SignUp/>,
            },
        ],
    },
    {
        title: "User",
        layout: "user",
        pages: [
            {
                icon: <ChartPieIcon {...icon} />,
                name: "forum",
                path: "/forum",
                element: <Forum/>,
            },
            {
                hidden: true,
                path: "/forum/:postId",
                element: <DetailPost/>,
            },
        ],
    },
];

export default routes;
