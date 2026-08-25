import { createRootRoute, createRoute } from "@tanstack/react-router";
import { RootComponent } from "./routes/__root";
import { IndexComponent } from "./routes/index";
import { AuthComponent } from "./routes/auth";
import { ReviewsComponent } from "./routes/reviews";
import { PrivacyComponent } from "./routes/privacy";
import { TermsComponent } from "./routes/terms";
import { TryItFreeComponent } from "./routes/try-it-free";
import { ProfileComponent } from "./routes/profile";
import { SupportComponent } from "./routes/support";
import { AdminComponent } from "./routes/admin";

const rootRoute = createRootRoute({ component: RootComponent });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: IndexComponent });
const authRoute = createRoute({ getParentRoute: () => rootRoute, path: "/auth", component: AuthComponent });
const reviewsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/reviews", component: ReviewsComponent });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/privacy", component: PrivacyComponent });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/terms", component: TermsComponent });
const tryItFreeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/try-it-free", component: TryItFreeComponent });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile", component: ProfileComponent });
const supportRoute = createRoute({ getParentRoute: () => rootRoute, path: "/support", component: SupportComponent });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: AdminComponent });

export const routeTree = rootRoute.addChildren([indexRoute, authRoute, reviewsRoute, privacyRoute, termsRoute, tryItFreeRoute, profileRoute, supportRoute, adminRoute]);