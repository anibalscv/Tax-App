import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { db } from '../services/mockDb';
import { ScanFace, Fingerprint, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'login' | 'biometric'>('login');
  const [email, setEmail] = useState('valeria.j@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.login(email);
      setLoading(false);
      setStep('biometric');
    } catch (error) {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    setLoading(true);
    await db.verifyBiometric();
    setLoading(false);
    onLogin();
  };

  if (step === 'biometric') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <div className="relative mx-auto h-24 w-24 flex items-center justify-center mb-6">
             <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-20"></div>
             <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <ScanFace className="h-10 w-10" />
             </div>
          </div>
          <h2 className="text-2xl font-bold">Verificación de Identidad</h2>
          <p className="text-slate-500">Por seguridad financiera, necesitamos confirmar que eres tú.</p>
        </div>

        <Button 
          onClick={handleBiometric} 
          fullWidth 
          className="h-14 text-base"
          isLoading={loading}
        >
          <Fingerprint className="mr-2 h-5 w-5" /> Escanear Biometría
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a TaxFlow</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Input 
              label="Contraseña" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
            <Button type="submit" fullWidth className="mt-6" isLoading={loading}>
              Ingresar
            </Button>
            <div className="text-center">
               <p className="text-xs text-slate-400 mt-4">Al ingresar aceptas nuestros Términos y Condiciones</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};