import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { UserRole } from "../types";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredRole = UserRole.SUPER_ADMIN,
}) => {
  const { session, supabase, isLoading } = useSession();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If still loading session, wait
    if (isLoading) return;

    // First check: no session at all = not authorized
    if (!session) {
      console.warn(
        "ProtectedAdminRoute: No session found, redirecting to admin-login",
      );
      setIsAuthorized(false);
      return;
    }

    // Second check: session exists but no user = not authorized
    if (!session.user) {
      console.warn(
        "ProtectedAdminRoute: Session has no user, redirecting to admin-login",
      );
      setIsAuthorized(false);
      return;
    }

    // Third check: verify user has admin role
    const checkAdminAccess = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("ProtectedAdminRoute: Error fetching profile:", error);
          setIsAuthorized(false);
          return;
        }

        if (!profileData) {
          console.warn("ProtectedAdminRoute: No profile found");
          setIsAuthorized(false);
          return;
        }

        const adminProfile = profileData as { role: string };
        const hasRequiredRole = adminProfile.role === requiredRole;

        if (!hasRequiredRole) {
          console.warn(
            `ProtectedAdminRoute: User has role "${adminProfile.role}", but required role is "${requiredRole}"`,
          );
        }

        setIsAuthorized(hasRequiredRole);
      } catch (err) {
        console.error("ProtectedAdminRoute: Admin verification error:", err);
        setIsAuthorized(false);
      }
    };

    checkAdminAccess();
  }, [session, isLoading, supabase, requiredRole]);

  // Show loading while checking authorization
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 bg-red-600/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="text-slate-300 font-bold">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authorized = redirect to admin login
  if (!isAuthorized) {
    console.warn(
      "ProtectedAdminRoute: Access denied, redirecting to /admin-login",
    );
    return <Navigate to="/admin-login" replace />;
  }

  // Authorized = render children
  return <>{children}</>;
};

export default ProtectedAdminRoute;
