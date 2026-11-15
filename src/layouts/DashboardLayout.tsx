import DashboardNav from "../components/dashboard-components/DashboardNav";
import NotVerifiedView from "../components/dashboard-components/NotVerifiedView";
import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboard-components/DashboardHeader";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { getIndividualUser } from "../api/admin-dashboard-apis";
import { useToast } from "../contexts/ToastContext";
import LoadingModal from "../components/LoadingModal";
import type { FullUserProfile } from "../constants/basic-types";

const DashboardLayout = () => {
  const { accessToken, user, userId, saveUserData } = useAuth();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApiError = useCallback((error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else {
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const getUserData = useCallback(async () => {
    if (!userId || !accessToken) return;
    setLoading(true);
    try {
      const res: FullUserProfile = await getIndividualUser({ token: accessToken, userID: Number(userId) });
      saveUserData(res);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, userId, saveUserData, handleApiError]);

  useEffect(() => {
    if (accessToken && (user === null || user.updated_at === undefined)) {
      getUserData();
    }
  }, [accessToken, user, getUserData]);
  if (accessToken === null) {
    return <Navigate to="/" replace />;
  }

  if (loading || (accessToken && !user)) {
    return <LoadingModal isLoading={true} />;
  }

  // if (user && (user.membership_verified || user.is_superuser || user.is_staff || user.is_verified)) {
  if (user) {
    return (
      <div className="bg-gray-100 h-screen flex gap-2 p-1 md:p-2 box-border overflow-hidden">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Desktop visible, Mobile as drawer */}
        <aside
          className={`fixed md:relative top-0 left-0 h-full w-64 z-50 md:z-auto flex flex-col overflow-hidden bg-gray-100 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
          <DashboardNav onClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        <div className="flex-1 flex flex-col gap-1 md:gap-2 overflow-hidden w-full md:w-auto">
          <div className="sticky top-0 z-10 bg-gray-100">
            <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          </div>

          <div className="flex-1 overflow-y-auto pr-0 md:pr-1">
            <Outlet />
          </div>
        </div>
      </div>
    );
  } else {
    return <NotVerifiedView />;
  }
}

export default DashboardLayout;
