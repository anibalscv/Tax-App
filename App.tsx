import React, { useState, useEffect } from 'react';
import { Layout, DashboardLayout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Auth } from './pages/Auth';
import { LinkTax } from './pages/LinkTax';
import { Dashboard } from './pages/Dashboard';
import { Payment } from './pages/Payment';
import { db } from './services/mockDb';

type Route = 'onboarding' | 'auth' | 'link' | 'dashboard' | 'payment';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('onboarding');
  const [selectedTaxId, setSelectedTaxId] = useState<string | null>(null);

  useEffect(() => {
    db.init();
    // Check if user is already logged in (simple session persistence)
    const state = db.getState();
    if (state.user?.isAuthenticated) {
        if(state.user.tax_id) {
            setCurrentRoute('dashboard');
        } else {
            setCurrentRoute('link');
        }
    }
  }, []);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const handleTaxSelection = (id: string) => {
    setSelectedTaxId(id);
    navigate('payment');
  };

  const handleLogout = () => {
    db.logout();
    navigate('onboarding');
  };

  const renderScreen = () => {
    switch (currentRoute) {
      case 'onboarding':
        return (
          <Layout>
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                <Onboarding onComplete={() => navigate('auth')} />
              </div>
            </div>
          </Layout>
        );
      
      case 'auth':
        return (
          <Layout>
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                <Auth onLogin={() => {
                    const state = db.getState();
                    // If already has tax ID linked, go to dashboard
                    if (state.user?.tax_id) {
                        navigate('dashboard');
                    } else {
                        navigate('link');
                    }
                }} />
              </div>
            </div>
          </Layout>
        );
      
      case 'link':
        return (
          <Layout>
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                <LinkTax onLinked={() => navigate('dashboard')} />
              </div>
            </div>
          </Layout>
        );
      
      case 'dashboard':
        return (
          <DashboardLayout onLogout={handleLogout}>
            <Dashboard onSelectTax={handleTaxSelection} />
          </DashboardLayout>
        );
      
      case 'payment':
        if (!selectedTaxId) return (
          <DashboardLayout onLogout={handleLogout}>
            <Dashboard onSelectTax={handleTaxSelection} />
          </DashboardLayout>
        );
        return (
          <DashboardLayout onLogout={handleLogout}>
            <Payment 
              taxId={selectedTaxId} 
              onBack={() => navigate('dashboard')}
              onSuccess={() => navigate('dashboard')}
            />
          </DashboardLayout>
        );
        
      default:
        return (
          <Layout>
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                <Onboarding onComplete={() => navigate('auth')} />
              </div>
            </div>
          </Layout>
        );
    }
  };

  return renderScreen();
};

export default App;