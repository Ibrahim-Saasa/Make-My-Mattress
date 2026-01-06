
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
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

type AppScreen = 'LOGIN' | 'IDENTITY' | 'BRAND_HALL' | 'CONFIGURATOR' | 'PDP' | 'SERVICE_HUB' | 'SERVICE_BOOKER' | 'TECHNICIAN_PORTAL' | 'ADMIN_CAPITOL' | 'FACTORY_KANBAN' | 'DEALER_DASHBOARD' | 'CHECKOUT';

interface CartItem {
  brand: BrandMetadata;
  dimensions: string;
  pricing: PricingResult;
  id: string;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('LOGIN');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandMetadata | null>(null);
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigateTo = (nextScreen: AppScreen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScreen(nextScreen);
  };

  const handleLoginSuccess = () => {
    navigateTo('IDENTITY');
  };

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.TECHNICIAN) navigateTo('TECHNICIAN_PORTAL');
    else if (role === UserRole.SUPER_ADMIN) navigateTo('ADMIN_CAPITOL');
    else if (role === UserRole.FACTORY_MANAGER) navigateTo('FACTORY_KANBAN');
    else if (role === UserRole.DEALER) navigateTo('DEALER_DASHBOARD');
    else navigateTo('BRAND_HALL');
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

  const isIndustrialScreen = ['ADMIN_CAPITOL', 'FACTORY_KANBAN', 'TECHNICIAN_PORTAL', 'DEALER_DASHBOARD', 'SERVICE_BOOKER', 'LOGIN', 'CHECKOUT'].includes(screen);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 overflow-x-hidden font-sans">
      {screen !== 'IDENTITY' && screen !== 'LOGIN' && !isIndustrialScreen && (
        <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo('BRAND_HALL')}>
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
              <button onClick={() => navigateTo('LOGIN')} className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Logout</button>
            </div>
          </div>
        </header>
      )}

      <main className={`${(screen !== 'IDENTITY' && screen !== 'LOGIN' && !isIndustrialScreen) ? 'pt-24' : ''}`}>
        {screen === 'LOGIN' && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
        {screen === 'IDENTITY' && <IdentityScreen onSelectRole={handleRoleSelection} />}
        {screen === 'BRAND_HALL' && <BrandHall onSelectBrand={brand => { setSelectedBrand(brand); navigateTo('CONFIGURATOR'); }} />}
        {screen === 'CONFIGURATOR' && selectedBrand && (
          <SmartConfigurator 
            brand={selectedBrand} 
            userRole={userRole!} 
            onNext={(params, pricing) => handleAddToCart(selectedBrand, params, pricing)} 
            onBack={() => navigateTo('BRAND_HALL')} 
            onBookService={() => navigateTo('SERVICE_HUB')} 
          />
        )}
        {screen === 'CHECKOUT' && cartItems.length > 0 && (
          <CheckoutScreen 
            cartItems={cartItems} 
            onBack={() => navigateTo('CONFIGURATOR')} 
            onOrderSuccess={() => { setCartItems([]); navigateTo('BRAND_HALL'); }}
          />
        )}
        {screen === 'PDP' && selectedBrand && <ProductDetailPage brand={selectedBrand} userRole={userRole!} onBack={() => navigateTo('CONFIGURATOR')} />}
        {screen === 'SERVICE_HUB' && <ServiceHub onBack={() => navigateTo('CONFIGURATOR')} onSelect={() => navigateTo('SERVICE_BOOKER')} />}
        {screen === 'SERVICE_BOOKER' && <ServiceBooker onBack={() => navigateTo('SERVICE_HUB')} onSuccess={() => navigateTo('CONFIGURATOR')} />}
        {screen === 'TECHNICIAN_PORTAL' && <TechnicianPortal onBack={() => navigateTo('LOGIN')} />}
        {screen === 'ADMIN_CAPITOL' && <AdminCapitol />}
        {screen === 'FACTORY_KANBAN' && <FactoryKanban />}
        {screen === 'DEALER_DASHBOARD' && <DealerDashboard onBack={() => navigateTo('BRAND_HALL')} />}
      </main>

      <SleepConsultant isOpen={isAiConsultantOpen} onClose={() => setIsAiConsultantOpen(false)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={removeItem}
        onCheckout={() => { setIsCartOpen(false); navigateTo('CHECKOUT'); }}
      />
    </div>
  );
};

export default App;
