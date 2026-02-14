import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      setIsAuthorized(false);
      return;
    }

    const checkAdminAccess = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !profileData) {
          setIsAuthorized(false);
          return;
        }

        const adminProfile = profileData as { role: string };
        // Check if user has required admin role
        setIsAuthorized(adminProfile.role === requiredRole);
      } catch (err) {
        console.error("Admin verification error:", err);
        setIsAuthorized(false);
      }
    };

    checkAdminAccess();
  }, [session, isLoading, supabase, requiredRole]);

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

  if (!isAuthorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
