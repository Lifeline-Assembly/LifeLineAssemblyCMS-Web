import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import LandingLayout from "./layouts/LandingLayout";
import { ErrorPage } from "./pages/ErrorPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";

// Landing Pages
const HomePage = lazy(() => import("./pages/landing-pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth-pages/LoginPage"));
const Register = lazy(() => import("./pages/auth-pages/Register"));
const ForgotPassword = lazy(() => import("./pages/auth-pages/ForgotPassword"));
const AboutUsPage = lazy(() => import("./pages/landing-pages/AboutUsPage"));
const SermonsPage = lazy(() => import("./pages/landing-pages/SermonsPage"));
const BlogPage = lazy(() => import("./pages/landing-pages/BlogPage"));
const SingleBlogPage = lazy(() => import("./pages/landing-pages/SingleBlogPage"));
const GalleryPage = lazy(() => import("./pages/landing-pages/GalleryPage"));
const ContactPage = lazy(() => import("./pages/landing-pages/ContactPage"));
const EachSermonPage = lazy(() => import('./pages/landing-pages/inner-pages/EachSermon'));
const EachEventPage = lazy(() => import('./pages/landing-pages/inner-pages/EachEvent'))

// Dashboard Pages
const DashboardPage = lazy(() =>
  import("./pages/dashboard-pages/DashboardPage")
);
const UserAccessPage = lazy(() =>
  import("./pages/dashboard-pages/UserAccessPage")
);
const AnalyticsPage = lazy(() =>
  import("./pages/dashboard-pages/AnalyticsPage")
);

const MembersPage = lazy(() =>
  import("./pages/dashboard-pages/MembersPage")
);
const PastorsPage = lazy(() =>
  import("./pages/dashboard-pages/PastorsPage")
);
const StaffPage = lazy(() => import("./pages/dashboard-pages/StaffPage"));
const EventsPage = lazy(() =>
  import("./pages/dashboard-pages/EventsPage")
);
const DashboardSermonsPage = lazy(() => import("./pages/dashboard-pages/SermonsPage"));
const DashboardBlogsPage = lazy(() => import("./pages/dashboard-pages/BlogsPage"));

const FinancialsPage = lazy(() =>
  import("./pages/dashboard-pages/FinancialsPage")
);
const CommunicationPage = lazy(() =>
  import("./pages/dashboard-pages/CommunicationPage")
);

const SettingsPage = lazy(() =>
  import("./pages/dashboard-pages/SettingsPage")
);
const DataManagementPage = lazy(() =>
  import("./pages/dashboard-pages/DataManagementPage")
);
const SecurityPage = lazy(() =>
  import("./pages/dashboard-pages/SecurityPage")
);

const AppointmentPage = lazy(() => import('./pages/dashboard-pages/AppointmentPage'));

const PrayerRequestPage = lazy(() => import('./pages/dashboard-pages/PrayerRequestPage'));
const PrayerRequestDetailPage = lazy(() => import('./pages/dashboard-pages/PrayerRequestDetailsPage'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "about", element: <AboutUsPage /> },
      { path: "sermons", element: <SermonsPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "blog/:slug", element: <SingleBlogPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "sermons/:id", element: <EachSermonPage /> },
      { path: "event/:id", element: <EachEventPage /> }
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "user-access", element: <UserAccessPage /> },
      { path: "analytics", element: <AnalyticsPage /> },

      { path: "members", element: <MembersPage /> },
      { path: "pastors", element: <PastorsPage /> },
      { path: "staff", element: <StaffPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "sermons", element: <DashboardSermonsPage /> },
      { path: "blogs", element: <DashboardBlogsPage /> },
      { path: "financials", element: <FinancialsPage /> },
      { path: "communication", element: <CommunicationPage /> },
      { path: 'appointments', element: <AppointmentPage /> },
      { path: 'prayer-requests', element: <PrayerRequestPage /> },
      { path: 'prayer-requests/:id', element: <PrayerRequestDetailPage />},

      { path: "settings", element: <SettingsPage /> },
      { path: "data-management", element: <DataManagementPage /> },
      { path: "security", element: <SecurityPage /> },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;

