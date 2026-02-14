import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSession } from "./src/contexts/SessionContext";
import { useTheme } from "./src/contexts/ThemeContext"; // Import useTheme
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import AdminLoginScreen from "./components/AdminLoginScreen";
import IdentityScreen from "./components/IdentityScreen";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import BrandHall from "./components/BrandHall";
import SmartConfigurator from "./components/SmartConfigurator";
import ProductDetailPage from "./components/ProductDetailPage";
import OnboardingRouter from "./components/Onboarding/OnboardingRouter";
import StudioIntro from "./components/Studio/StudioIntro";
import StudioStepper from "./components/Studio/StudioStepper";
import StudioSummary from "./components/Studio/StudioSummary";
import SleepConsultant from "./components/SleepConsultant";
import ServiceBooker from "./components/ServiceBooker";
import ServiceHub from "./components/ServiceHub";
import TechnicianPortal from "./components/TechnicianPortal";
import AdminCapitol from "./components/AdminCapitol";
import FactoryKanban from "./components/FactoryKanban";
import DealerDashboard from "./components/DealerDashboard";
import CheckoutScreen from "./components/CheckoutScreen";
import CartDrawer from "./components/CartDrawer";
import ProfilePage from "./components/ProfilePage";
import { ProductWizardProvider } from "./contexts/ProductWizardContext";
import ProductWizardModal from "./components/ProductWizard/ProductWizardModal";
import ProductWizardFloatingButton from "./components/ProductWizard/ProductWizardFloatingButton";
import { UserRole, BrandMetadata, PricingResult, Cart } from "./types";

interface CartItem {
  brand: BrandMetadata;
  dimensions: string;
  pricing: PricingResult;
  id: string;
}

const App: React.FC = () => {
  const { session, isLoading, supabase } = useSession();
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandMetadata | null>(
    null,
  );
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isRoleDetermined, setIsRoleDetermined] = useState(false); // New state

  useEffect(() => {
    if (isLoading) {
      return; // Still loading session, do nothing
    }

    if (!session) {
      // User is not authenticated, redirect to login if not already there
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/admin-login"
      ) {
        navigate("/login", { replace: true });
      }
      setIsRoleDetermined(true); // Role is "undetermined" because no session, so we can proceed
      return;
    }

    const fetchProfileAndRedirect = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, first_name")
        .eq("id", session.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        // Real error fetching profile, log and ensure user is on identity to resolve
        console.error("Error fetching profile:", profileError);
        if (location.pathname !== "/identity") {
          navigate("/identity", { replace: true });
        }
        setUserRole(null);
        setUserName(null);
        setIsRoleDetermined(true);
        return;
      }

      if (!profileData || !profileData.role) {
        // Profile exists but no role, or profile doesn't exist (PGRST116)
        // User needs to select a role. Ensure they are on /identity and stop further redirection.
        if (location.pathname !== "/identity") {
          navigate("/identity", { replace: true });
        }
        setUserRole(null);
        setUserName(null);
        setIsRoleDetermined(true);
        return;
      }

      // Profile with role found
      const role = profileData.role as UserRole;
      setUserRole(role);
      setUserName(profileData.first_name || null);

      const initialEntryPaths = [
        "/",
        "/login",
        "/signup",
        "/identity",
        "/admin-login",
      ];
      const shouldRedirectFromBrandHall =
        role !== UserRole.END_USER && location.pathname === "/brand-hall";

      // Only redirect if the current path is one of the initial entry points
      // or if a non-END_USER is on /brand-hall (which they shouldn't be).
      if (
        initialEntryPaths.includes(location.pathname) ||
        shouldRedirectFromBrandHall
      ) {
        if (role === UserRole.TECHNICIAN)
          navigate("/technician-portal", { replace: true });
        else if (role === UserRole.SUPER_ADMIN)
          navigate("/admin-capitol", { replace: true });
        else if (role === UserRole.FACTORY_MANAGER)
          navigate("/factory-kanban", { replace: true });
        else if (role === UserRole.DEALER)
          navigate("/dealer-dashboard", { replace: true });
        else navigate("/brand-hall", { replace: true }); // Default for END_USER
      }
      setIsRoleDetermined(true); // Role is now determined, can render routes
    };

    fetchProfileAndRedirect();
  }, [session, isLoading, navigate, supabase, location.pathname]);

  const handleRoleSelection = async (role: UserRole) => {
    setUserRole(role);
    if (session) {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: session.user.id, role: role }, { onConflict: "id" });

      if (error) {
        console.error("Error updating user role:", error);
      }
    }

    if (role === UserRole.TECHNICIAN) navigate("/technician-portal");
    else if (role === UserRole.SUPER_ADMIN) navigate("/admin-capitol");
    else if (role === UserRole.FACTORY_MANAGER) navigate("/factory-kanban");
    else if (role === UserRole.DEALER) navigate("/dealer-dashboard");
    else navigate("/brand-hall");
  };

  const handleAddToCart = (
    brand: BrandMetadata,
    params: any,
    pricing: PricingResult,
  ) => {
    const newItem: CartItem = {
      brand,
      dimensions: `${params.length}x${params.breadth}x${params.thickness}`,
      pricing,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setUserName(null);
    setIsRoleDetermined(false); // Reset role determination on logout
    navigate("/login");
  };

  if (isLoading || !isRoleDetermined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-background text-theme-primary">
        Loading application...
      </div>
    );
  }

  const isIndustrialScreen = [
    "/admin-capitol",
    "/factory-kanban",
    "/technician-portal",
    "/dealer-dashboard",
    "/service-booker",
    "/login",
    "/checkout",
    "/signup",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <ProductWizardProvider>
      <div className="min-h-screen bg-theme-background text-theme-primary overflow-x-hidden font-sans">
        {location.pathname !== "/identity" &&
          location.pathname !== "/login" &&
          location.pathname !== "/signup" &&
          !isIndustrialScreen && (
            <header className="fixed top-0 w-full z-40 bg-theme-card backdrop-blur-xl border-b border-theme-border px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => navigate("/brand-hall")}
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-indigo-700 transition-colors">
                    M
                  </div>
                  <span className="font-bold tracking-tight text-theme-primary uppercase text-sm">
                    Hindustan Mattress Co.
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  {userName && (
                    <span className="text-sm font-bold text-theme-secondary">
                      Hello, {userName}!
                    </span>
                  )}
                  <button
                    onClick={() => navigate("/profile")}
                    className="p-2 text-theme-secondary hover:text-indigo-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-theme-secondary hover:text-indigo-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-amber text-brand-navy text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-theme-card">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setIsAiConsultantOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                  >
                    ASK SLEEP EXPERT
                  </button>

                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-theme-secondary hover:text-indigo-600 transition-colors"
                    title={
                      theme === "light"
                        ? "Switch to Dark Mode"
                        : "Switch to Light Mode"
                    }
                  >
                    {theme === "light" ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-theme-secondary hover:text-indigo-600 uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>
          )}

        <main
          className={`${location.pathname !== "/identity" && location.pathname !== "/login" && location.pathname !== "/signup" && !isIndustrialScreen ? "pt-24" : ""}`}
        >
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/admin-login" element={<AdminLoginScreen />} />
            <Route
              path="/identity"
              element={<IdentityScreen onSelectRole={handleRoleSelection} />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/brand-hall"
              element={
                <BrandHall
                  onSelectBrand={(brand) => {
                    setSelectedBrand(brand);
                    navigate("/configurator");
                  }}
                  userName={userName}
                />
              }
            />
            <Route
              path="/configurator"
              element={
                selectedBrand ? (
                  <SmartConfigurator
                    brand={selectedBrand}
                    userRole={userRole!}
                    onNext={(params, pricing) =>
                      handleAddToCart(selectedBrand, params, pricing)
                    }
                    onBack={() => navigate("/brand-hall")}
                    onBookService={() => navigate("/service-hub")}
                  />
                ) : (
                  <Navigate to="/brand-hall" />
                )
              }
            />
            <Route
              path="/checkout"
              element={
                cartItems.length > 0 ? (
                  <CheckoutScreen
                    cartItems={cartItems}
                    onBack={() => navigate("/configurator")}
                    onOrderSuccess={() => {
                      setCartItems([]);
                      navigate("/brand-hall");
                    }}
                  />
                ) : (
                  <Navigate to="/brand-hall" />
                )
              }
            />
            <Route
              path="/pdp"
              element={
                selectedBrand ? (
                  <ProductDetailPage
                    brand={selectedBrand}
                    userRole={userRole!}
                    onBack={() => navigate("/configurator")}
                  />
                ) : (
                  <Navigate to="/brand-hall" />
                )
              }
            />
            <Route
              path="/service-hub"
              element={
                <ServiceHub
                  onBack={() => navigate("/configurator")}
                  onSelect={() => navigate("/service-booker")}
                />
              }
            />
            <Route
              path="/service-booker"
              element={
                <ServiceBooker
                  onBack={() => navigate("/service-hub")}
                  onSuccess={() => navigate("/configurator")}
                />
              }
            />
            <Route
              path="/technician-portal"
              element={<TechnicianPortal onBack={handleLogout} />}
            />
            <Route
              path="/admin-capitol"
              element={
                <ProtectedAdminRoute>
                  <AdminCapitol />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/factory-kanban" element={<FactoryKanban />} />
            <Route
              path="/dealer-dashboard"
              element={
                <DealerDashboard onBack={() => navigate("/brand-hall")} />
              }
            />
            <Route
              path="/"
              element={
                session ? (
                  <Navigate to="/brand-hall" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>

        <SleepConsultant
          isOpen={isAiConsultantOpen}
          onClose={() => setIsAiConsultantOpen(false)}
        />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={removeItem}
          onCheckout={() => {
            setIsCartOpen(false);
            navigate("/checkout");
          }}
        />

        {/* Product Wizard Modal and Floating Button */}
        {session && userRole === UserRole.END_USER && (
          <>
            <ProductWizardModal />
            <ProductWizardFloatingButton />
          </>
        )}
      </div>
    </ProductWizardProvider>
  );
};

export default App;
