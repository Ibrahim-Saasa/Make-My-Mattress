import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useSession } from './src/contexts/SessionContext';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import IdentityScreen from './components/IdentityScreen';
import BrandHall from './components/BrandHall';
import SmartConfigurator from './components/SmartConfigurator';
import ProductDetailPage from './components/ProductDetailPage';
import SleepConsultant from './components/SleepConsultant';
import ServiceBooker from './components/ServiceBooker';
import ServiceHub from './components/ServiceHub';
import TechnicianPortal from './components/TechnicianPortal';
import AdminCapitol from './components/AdminCapitol';
import FactoryKanban from './components/FactoryKanban';
import DealerDashboard from './components/DealerDashboard';
import CheckoutScreen from './components/CheckoutScreen';
import CartDrawer from './components/CartDrawer';
import { UserRole, BrandMetadata, PricingResult, Cart } from './types';

interface CartItem {
  brand: BrandMetadata;
  dimensions: string;
  pricing: PricingResult;
  id: string;
}

const App: React.FC = () => {
  const { session, isLoading, supabase } = useSession();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandMetadata | null>(null);
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate('/login', { replace: true });
      } else {
        const fetchProfile = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error('Error fetching profile:', error);
            // If there's an actual error (not just no profile), still go to identity to allow selection
            navigate('/identity', { replace: true });
          } else if (data && data.role) { // Profile exists AND role is set
            setUserRole(data.role as UserRole);
            // Redirect based on role if already set
            if (data.role === UserRole.TECHNICIAN) navigate('/technician-portal', { replace: true });
            else if (data.role === UserRole.SUPER_ADMIN) navigate('/admin-capitol', { replace: true });
            else if (data.role === UserRole.FACTORY_MANAGER) navigate('/factory-kanban', { replace: true });
            else if (data.role === UserRole.DEALER) navigate('/dealer-dashboard', { replace: true });
            else navigate('/brand-hall', { replace: true }); // Default for END_USER or other roles
          } else { // No profile found (PGRST116) OR profile exists but role is NULL
            navigate('/identity', { replace: true });
          }
        };
        fetchProfile();
      }
    }
  }, [session, isLoading, navigate, supabase]);

  const handleRoleSelection = async (role: UserRole) => {
    setUserRole(role);
    if (session) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: session.user.id, role: role }, { onConflict: 'id' });

      if (error) {
        console.error('Error updating user role:', error);
        // Handle error, maybe show a toast
      }
    }

    if (role === UserRole.TECHNICIAN) navigate('/technician-portal');
    else if (role === UserRole.SUPER_ADMIN) navigate('/admin-capitol');
    else if (role === UserRole.FACTORY_MANAGER) navigate('/factory-kanban');
    else if (role === UserRole.DEALER) navigate('/dealer-dashboard');
    else navigate('/brand-hall');
  };

  const handleAddToCart = (brand: BrandMetadata, params: any, pricing: PricingResult) => {
    const newItem: CartItem = {
      brand,
      dimensions: `${params.length}x${params.breadth}x${params.thickness}`,
      pricing,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] text-slate-900">
        Loading application...
      </div>
    );
  }

  const isIndustrialScreen = ['/admin-capitol', '/factory-kanban', '/technician-portal', '/dealer-dashboard', '/service-booker', '/login', '/checkout', '/signup'].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 overflow-x-hidden font-sans">
      {location.pathname !== '/identity' && location.pathname !== '/login' && location.pathname !== '/signup' && !isIndustrialScreen && (
        <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/brand-hall')}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-indigo-700 transition-colors">M</div>
              <span className="font-bold tracking-tight text-slate-800 uppercase text-sm">Hindustan Mattress Co.</span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-amber text-brand-navy text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button onClick={() => setIsAiConsultantOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100">ASK SLEEP EXPERT</button>
              <button onClick={handleLogout} className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Logout</button>
            </div>
          </div>
        </header>
      )}

      <main className={`${(location.pathname !== '/identity' && location.pathname !== '/login' && location.pathname !== '/signup' && !isIndustrialScreen) ? 'pt-24' : ''}`}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/identity" element={<IdentityScreen onSelectRole={handleRoleSelection} />} />
          <Route path="/brand-hall" element={<BrandHall onSelectBrand={brand => { setSelectedBrand(brand); navigate('/configurator'); }} />} />
          <Route path="/configurator" element={selectedBrand ? (
            <SmartConfigurator 
              brand={selectedBrand} 
              userRole={userRole!} 
              onNext={(params, pricing) => handleAddToCart(selectedBrand, params, pricing)} 
              onBack={() => navigate('/brand-hall')} 
              onBookService={() => navigate('/service-hub')} 
            />
          ) : <Navigate to="/brand-hall" />} />
          <Route path="/checkout" element={cartItems.length > 0 ? (
            <CheckoutScreen 
              cartItems={cartItems} 
              onBack={() => navigate('/configurator')} 
              onOrderSuccess={() => { setCartItems([]); navigate('/brand-hall'); }}
            />
          ) : <Navigate to="/brand-hall" />} />
          <Route path="/pdp" element={selectedBrand ? <ProductDetailPage brand={selectedBrand} userRole={userRole!} onBack={() => navigate('/configurator')} /> : <Navigate to="/brand-hall" />} />
          <Route path="/service-hub" element={<ServiceHub onBack={() => navigate('/configurator')} onSelect={() => navigate('/service-booker')} />} />
          <Route path="/service-booker" element={<ServiceBooker onBack={() => navigate('/service-hub')} onSuccess={() => navigate('/configurator')} />} />
          <Route path="/technician-portal" element={<TechnicianPortal onBack={handleLogout} />} />
          <Route path="/admin-capitol" element={<AdminCapitol />} />
          <Route path="/factory-kanban" element={<FactoryKanban />} />
          <Route path="/dealer-dashboard" element={<DealerDashboard onBack={() => navigate('/brand-hall')} />} />
          <Route path="/" element={session ? <Navigate to="/brand-hall" /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      <SleepConsultant isOpen={isAiConsultantOpen} onClose={() => setIsAiConsultantOpen(false)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={removeItem}
        onCheckout={() => { setIsCartOpen(false); navigate('/checkout'); }}
      />
    </div>
  );
};

export default App;