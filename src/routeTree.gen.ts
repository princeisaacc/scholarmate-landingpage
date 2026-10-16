import { createRootRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { NotFoundComponent, RootComponent } from "./routes/__root";
import { IndexComponent } from "./routes/index";

// Only the landing page is in the main bundle. Every other page loads when it is opened.
const rootRoute = createRootRoute({ component: RootComponent, notFoundComponent: NotFoundComponent });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: IndexComponent });
const authRoute = createRoute({ getParentRoute: () => rootRoute, path: "/auth", component: lazyRouteComponent(() => import("./routes/auth"), "AuthComponent") });
const reviewsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/reviews", component: lazyRouteComponent(() => import("./routes/reviews"), "ReviewsComponent") });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/privacy", component: lazyRouteComponent(() => import("./routes/privacy"), "PrivacyComponent") });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/terms", component: lazyRouteComponent(() => import("./routes/terms"), "TermsComponent") });
const tryItFreeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/try-it-free", component: lazyRouteComponent(() => import("./routes/try-it-free"), "TryItFreeComponent") });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile", component: lazyRouteComponent(() => import("./routes/profile"), "ProfileComponent") });
const supportRoute = createRoute({ getParentRoute: () => rootRoute, path: "/support", component: lazyRouteComponent(() => import("./routes/support"), "SupportComponent") });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: lazyRouteComponent(() => import("./routes/admin"), "AdminComponent") });

export const routeTree = rootRoute.addChildren([indexRoute, authRoute, reviewsRoute, privacyRoute, termsRoute, tryItFreeRoute, profileRoute, supportRoute, adminRoute]);
