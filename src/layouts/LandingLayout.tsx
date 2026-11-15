import { Navigate, Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/buttons/ScrollToTopButton";
import { useAuth } from "../hooks/useAuth";

const LandingLayout = () => {
  const { accessToken } = useAuth();

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default LandingLayout