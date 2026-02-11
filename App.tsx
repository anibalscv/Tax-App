import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
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

  const renderScreen = () => {
    switch (currentRoute) {
      case 'onboarding':
        return <Onboarding onComplete={() => navigate('auth')} />;
      
      case 'auth':
        return <Auth onLogin={() => {
            const state = db.getState();
            // If already has tax ID linked, go to dashboard
            if (state.user?.tax_id) {
                navigate('dashboard');
            } else {
                navigate('link');
            }
        }} />;
      
      case 'link':
        return <LinkTax onLinked={() => navigate('dashboard')} />;
      
      case 'dashboard':
        return <Dashboard onSelectTax={handleTaxSelection} />;
      
      case 'payment':
        if (!selectedTaxId) return <Dashboard onSelectTax={handleTaxSelection} />;
        return (
          <Payment 
            taxId={selectedTaxId} 
            onBack={() => navigate('dashboard')}
            onSuccess={() => navigate('dashboard')}
          />
        );
        
      default:
        return <Onboarding onComplete={() => navigate('auth')} />;
    }
  };

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  );
};

export default App;