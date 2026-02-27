import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { db } from '../services/mockDb';
import { UserCircle } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate login. We use a default email if none is provided.
      const loginEmail = email.trim() || 'valeria.j@example.com';
      await db.login(loginEmail);
      // Skip biometric verification
      const state = db.getState();
      if (state.user) {
        state.user.biometricVerified = true;
        db.setState(state);
      }
      setLoading(false);
      onLogin();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
            <UserCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>Ingresa a tu cuenta de TaxFlow de forma segura</CardDescription>
        </CardHeader>
        <CardContent className="px-0 mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email (Opcional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
            <Input
              label="Contraseña (Opcional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" fullWidth className="h-14 text-base shadow-lg shadow-indigo-200 mt-6" isLoading={loading}>
              Ingresar a mi cuenta
            </Button>

            <div className="text-center mt-6 space-y-4">
              <p className="text-sm text-slate-600">
                ¿No tienes una cuenta?{' '}
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Crear nueva cuenta
                </a>
              </p>
              <p className="text-xs text-slate-400">Al ingresar aceptas nuestros Términos y Condiciones</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};