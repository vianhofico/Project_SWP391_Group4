// routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
import routes from "./routes";
import DashboardLayout from "@/layouts/DashboardLayout"; // hoặc đường dẫn đúng
import AuthLayout from "@/layouts/AuthLayout"; // nếu có, còn không dùng <div />

const convertRoutes = () => {
  return routes.map(({ layout, pages }) => {
    const layoutComponent =
      layout === "dashboard"
        ? <DashboardLayout />
        : layout === "auth"
        ? <AuthLayout />
        : <div />;

    return {
      path: "/",
      element: layoutComponent,
      children: pages.map((page) => ({
        index: page.path === "/" || page.path === "", // fallback
        path: page.path.replace(/^\//, ""), // bỏ dấu "/" đầu
        element: page.element,
      })),
    };
  });
};

const router = createBrowserRouter(convertRoutes());

export default router;
