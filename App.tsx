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
import ResetPage from "./components/ResetPage";
import { ProductWizardProvider } from "./contexts/ProductWizardContext";
import ProductWizardModal from "./components/ProductWizard/ProductWizardModal";
import ProductWizardFloatingButton from "./components/ProductWizard/ProductWizardFloatingButton";
import { UserRole, BrandMetadata, PricingResult } from "./types";
import { BrandLogo } from "./components/UI";

interface CartItem {
  brand: BrandMetadata;
  dimensions: string;
  pricing: PricingResult;
  id: string;
}

const SELECTED_BRAND_STORAGE_KEY = "mmm:selectedBrand";
const CART_STORAGE_KEY = "mmm:cartItems";

const App: React.FC = () => {
  const { session, isLoading, supabase, clearSession } = useSession();
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandMetadata | null>(null);
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isRoleDetermined, setIsRoleDetermined] = useState(false); // New state

  useEffect(() => {
    try {
      const storedBrand = localStorage.getItem(SELECTED_BRAND_STORAGE_KEY);
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (storedBrand) {
        setSelectedBrand(JSON.parse(storedBrand));
      }

      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to restore shopper state:", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (selectedBrand) {
        localStorage.setItem(
          SELECTED_BRAND_STORAGE_KEY,
          JSON.stringify(selectedBrand),
        );
      } else {
        localStorage.removeItem(SELECTED_BRAND_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to persist selected brand:", error);
    }
  }, [selectedBrand]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to persist cart:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    if (isLoading) {
      return; // Still loading session, do nothing
    }

    // FIRST: Check if user is trying to access admin routes without authentication
    if (!session && location.pathname === "/admin-capitol") {
      console.warn(
        "Unauthorized access attempt to /admin-capitol, redirecting to /admin-login",
      );
      navigate("/admin-login", { replace: true });
      setIsRoleDetermined(true);
      return;
    }

    if (!session) {
      const protectedRoutes = [
        "/identity",
        "/profile",
        "/technician-portal",
        "/factory-kanban",
        "/dealer-dashboard",
      ];

      if (protectedRoutes.some((path) => location.pathname.startsWith(path))) {
        navigate("/login", { replace: true });
      }

      setUserRole(UserRole.END_USER);
      setUserName(null);
      setIsRoleDetermined(true);
      return;
    }

    // Session exists, validate it's still valid
    if (!session.user) {
      navigate("/login", { replace: true });
      setIsRoleDetermined(true);
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
        "/reset",
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

  const handleBrandSelection = (brand: BrandMetadata) => {
    setSelectedBrand(brand);
    navigate("/configurator");
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = async () => {
    await clearSession();
    setUserRole(null);
    setUserName(null);
    setIsRoleDetermined(false);
    navigate("/login", { replace: true });
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
          location.pathname !== "/brand-hall" &&
          !isIndustrialScreen && (
            <header className="fixed top-0 w-full z-40 border-b border-theme-border bg-theme-card/95 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
              <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between gap-3">
                <div
                  className="flex min-w-0 items-center gap-2 cursor-pointer group"
                  onClick={() => navigate("/brand-hall")}
                >
                  <BrandLogo
                    className="group-hover:scale-[1.02] transition-transform"
                    compact
                    size="sm"
                  />
                  <div className="hidden min-[420px]:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-theme-subtext">
                      Make My Mattress
                    </p>
                    <p className="mt-1 text-xs text-theme-secondary">
                      Factory-direct comfort
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 md:hidden">
                  <button
                    onClick={() => setIsAiConsultantOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(23,64,209,0.12)] bg-[rgba(23,64,209,0.06)] text-[var(--brand-primary)] transition-all hover:bg-[var(--brand-primary)] hover:text-white"
                    title="Ask sleep expert"
                    aria-label="Ask sleep expert"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-theme-secondary transition-colors hover:text-indigo-600"
                    aria-label="Open cart"
                  >
                    <svg
                      className="h-6 w-6"
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
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-theme-card bg-brand-amber text-[10px] font-black text-brand-navy">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-theme-secondary transition-colors hover:text-indigo-600"
                    title={
                      theme === "light"
                        ? "Switch to Dark Mode"
                        : "Switch to Light Mode"
                    }
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? (
                      <svg
                        className="h-6 w-6"
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
                        className="h-6 w-6"
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
                </div>

                <div className="hidden items-center gap-6 md:flex">
                  {userName && (
                    <span className="text-sm font-bold text-theme-secondary">
                      Hello, {userName}!
                    </span>
                  )}
                  {session && (
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
                  )}
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
                    className="flex items-center gap-2 rounded-full border border-[rgba(23,64,209,0.12)] bg-[rgba(23,64,209,0.06)] px-4 py-2 text-xs font-bold text-[var(--brand-primary)] transition-all hover:bg-[var(--brand-primary)] hover:text-white"
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

                  {session ? (
                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold text-theme-secondary hover:text-indigo-600 uppercase tracking-widest transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="rounded-full border border-theme-border px-4 py-2 text-xs font-bold text-theme-secondary hover:text-indigo-600 hover:border-indigo-200 uppercase tracking-widest transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>

                <div className="mt-3 flex items-center gap-2 md:hidden">
                  {session ? (
                    <>
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex min-w-0 flex-1 items-center justify-center rounded-full border border-theme-border px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-secondary transition-colors hover:text-indigo-600"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex min-w-0 flex-1 items-center justify-center rounded-full border border-theme-border px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-secondary transition-colors hover:text-indigo-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full rounded-full border border-theme-border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-secondary transition-colors hover:border-indigo-200 hover:text-indigo-600"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </header>
          )}

        <main
          className={`${location.pathname !== "/identity" && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/brand-hall" && !isIndustrialScreen ? "pt-32 md:pt-24" : ""}`}
        >
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/admin-login" element={<AdminLoginScreen />} />
            <Route path="/reset" element={<ResetPage />} />
            <Route
              path="/identity"
              element={<IdentityScreen onSelectRole={handleRoleSelection} />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/brand-hall"
              element={
                <BrandHall
                  onSelectBrand={handleBrandSelection}
                  userName={userName}
                  selectedBrand={selectedBrand}
                  onResumeBuild={() => navigate("/configurator")}
                  onOpenConsultant={() => setIsAiConsultantOpen(true)}
                  cartCount={cartItems.length}
                  isGuest={!session}
                  onLogin={() => navigate("/login")}
                />
              }
            />
            <Route
              path="/configurator"
              element={
                selectedBrand ? (
                  <SmartConfigurator
                    brand={selectedBrand}
                    userRole={userRole || UserRole.END_USER}
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
                    userRole={userRole || UserRole.END_USER}
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
                <Navigate to="/brand-hall" />
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
