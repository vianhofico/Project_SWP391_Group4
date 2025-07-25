import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {Profile, Users, Notifications, Posts} from "@/pages/dashboard";
import {SignIn} from "@/pages/auth";
import Reports from "/src/pages/dashboard/reports.jsx"
import UserDetail from "@/pages/dashboard/userDetail.jsx";
import UserTabs from "@/pages/dashboard/userTab.jsx";
import PostTopics from "@/pages/dashboard/postTopics.jsx";
import PostDetail from "@/pages/dashboard/postDetail.jsx";
import ReportDetails from "@/pages/dashboard/reportDetails.jsx";
import UpdateProfile from "@/pages/dashboard/updateProfile.jsx";
import Orders from "@/pages/dashboard/orders.jsx";
import OrderItems from "@/pages/dashboard/orderItems.jsx";
import DiscountEventManager from "@/pages/dashboard/discount_event.jsx";
import CreateEventPage from "@/pages/dashboard/createEvent.jsx";
import EditEventPage from "@/pages/dashboard/editEvent.jsx";
import CourseStatistics from "@/pages/dashboard/statistic.jsx";
import CourseList from "@/pages/dashboard/CourseList.jsx";
import ChapterLessonsPage from "@/pages/dashboard/ChapterLessonsPage.jsx";
import CourseChaptersPage from "@/pages/dashboard/CourseChaptersPage.jsx";
import EditLessonForm from "@/pages/dashboard/EditLessonForm.jsx";
import EditCourseForm from "@/pages/dashboard/EditCourseForm.jsx";
import Topics from "@/pages/dashboard/Topics.jsx";
import CreateResource from "@/pages/dashboard/CreateResource.jsx";
import Resource from "@/pages/dashboard/Resource.jsx";
import AddTopic from "@/pages/dashboard/AddTopic.jsx";
import NewLessonForm from "@/pages/dashboard/NewLessonForm.jsx";
import EditTopic from "@/pages/dashboard/EditTopic.jsx";
import NewCourseForm from "@/pages/dashboard/NewCourseForm.jsx";

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
                name: "user",
                path: "/users/:userRole",
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
                path: "/reports/:status",
                element: <Reports/>,
            },

            {
                hidden: true,
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
                path: "/:role/:userId/:tab",
                element: <UserTabs/>,
                hidden: true,
            },
            {
                path: "/posts/:postId",
                element: <PostDetail/>,
                hidden: true,
            },
            {
                path: "/reports/:reportId/check",
                element: <ReportDetails/>,
                hidden: true,
            },
            {
                path: "/update-profile",
                element: <UpdateProfile/>,
                hidden: true,
            },
            {
                icon: <TableCellsIcon {...icon}/>,
                name: "Order",
                path: "/orders",
                element: <Orders/>,
            },
            {
                hidden: true,
                icon: <TableCellsIcon {...icon}/>,
                name: "OrderItems",
                path: "/orderItems",
                element: <OrderItems/>,
            },
            {
                icon: <TableCellsIcon {...icon}/>,
                name: "Discount",
                path: "/discount",
                element: <DiscountEventManager/>,
            },
            {
                hidden: true,
                path: "/discount/create",
                element: <CreateEventPage/>,
            },
            {
                hidden: true,
                path: "/discount/edit/:id",
                element: <EditEventPage/>,
            },
            {
                icon: <TableCellsIcon {...icon}/>,
                name: "Statistic",
                path: "/statistic",
                element: <CourseStatistics/>,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: "topics",
                path: "/topics",
                element: <Topics/>,
            },
            {
                path: "/admin/lessons/:lessonId/resources/create",
                element: <CreateResource/>,
                hidden: true,
            },
            {
                path: "/admin/lessons/:lessonId/resources",
                element: <Resource/>,
                hidden: true,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: "courses",
                path: "/courses",
                element: <CourseList/>,
            },
            {
                name: "add topic",
                path: "/topics/add",
                element: <AddTopic/>,
                hidden: true,
            },
            {
                path: "/admin/chapters/:chapterId/lessons/new",
                element: <NewLessonForm/>,
            },
            {
                name: "edit topic",
                path: "topics/:topicId/courses",
                element: <EditTopic/>,
                hidden: true,
            },
            {
                name: "new course",
                path: "/courses/new",
                element: <NewCourseForm/>,
                hidden: true,
            },
            {
                name: "edit course",
                path: "/courses/edit/:courseId",
                element: <EditCourseForm/>,
                hidden: true,
            },
            {
                path: "/admin/chapters/:chapterId/lessons/:lessonId/edit",
                element: <EditLessonForm/>,
                hidden: true,
            },
            {
                path: "/admin/courses/:courseId/chapters",
                element: <CourseChaptersPage/>,
                hidden: true,
            },
            {
                name: "lessons",
                path: "/admin/chapters/:chapterId/lessons",
                element: <ChapterLessonsPage/>,
                hidden: true,
            },
            {
                path: "/admin/courses/topics",
                element: <CourseList/>,
                hidden: true,
            },
            {
                path: "/admin/courses/topics/:topicId",
                element: <CourseList/>,
                hidden: true,
            }
        ],
    },
    {
        layout: "auth",
        pages: [
            {
                hidden: true,
                icon: <ServerStackIcon {...icon} />,
                name: "sign in",
                path: "/sign-in",
                element: <SignIn/>,
            },
        ],
    },
];

export default routes;
