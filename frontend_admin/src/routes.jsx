import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Topics from "./pages/dashboard/Topics";
import AddTopic from "./pages/dashboard/AddTopic";
import EditTopic from "./pages/dashboard/EditTopic";
import CourseList from "./pages/dashboard/CourseList";
import NewCourseForm from "./pages/dashboard/NewCourseForm";
import EditCourseForm from "./pages/dashboard/EditCourseForm";
import CourseChaptersPage from "./pages/dashboard/CourseChaptersPage";
import ChapterLessonsPage from "./pages/dashboard/ChapterLessonsPage";
import NewLessonForm from "./pages/dashboard/NewLessonForm";
import EditLessonForm from "./pages/dashboard/EditLessonForm";
import Resource from "./pages/dashboard/Resource";
import CreateResource from "./pages/dashboard/CreateResource";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "topics",
        path: "/topics",
        element: <Topics />,
      },
      {
          path: "/admin/lessons/:lessonId/resources/create",
         element:<CreateResource />,
      },
      {
        path:"/admin/lessons/:lessonId/resources",
        element:<Resource />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "courses",
        path: "/courses",
        element: <CourseList />,
      },
      {
        name: "add topic",
        path: "/topics/add",
        element: <AddTopic />,
        hidden: true,
      },
      {
        path:"/admin/chapters/:chapterId/lessons/new",
        element:<NewLessonForm />,
      },
      {
        name: "edit topic",
        path: "topics/:topicId/courses",
        element: <EditTopic />,
        hidden: true,
      },
      {
        name: "new course",
        path: "/courses/new",
        element: <NewCourseForm />,
        hidden: true,
      },
      {
        name: "edit course",
        path: "/courses/edit/:courseId",
        element: <EditCourseForm />,
        hidden: true,
      },
      {
        path: "/admin/chapters/:chapterId/lessons/:lessonId/edit",
        element: <EditLessonForm />,
      },
      {
        path: "/admin/courses/:courseId/chapters",
        element: <CourseChaptersPage />,
      },
      {
        name: "lessons",
        path: "/admin/chapters/:chapterId/lessons",
        element: <ChapterLessonsPage />,
        hidden: true, 
      },

      {
        path: "/admin/courses/topics",
        element: <CourseList />,
      },
      {
  path: "/admin/courses/topics/:topicId",
  element: <CourseList />,
},
    
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
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
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
