import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRight, Clock, ShieldCheck, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <>
      <div className="flex-1 flex flex-col p-8 md:p-12 justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
        <div className="max-w-md mx-auto w-full">
          <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Adiós filas.<br/>Hola libertad.
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            La forma más inteligente de gestionar tus obligaciones fiscales. Sin estrés, sin demoras y 100% seguro.
          </p>
          
          <div className="space-y-4 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Clock className="h-5 w-5 text-indigo-200" />
              </div>
              <span>Paga en segundos, no horas</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-indigo-200" />
              </div>
              <span>Seguridad biométrica bancaria</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-8 md:p-12 justify-center bg-white">
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="space-y-4 md:hidden">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Paga en segundos, no horas</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Seguridad biométrica bancaria</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Comienza ahora</h2>
            <p className="text-slate-500 mb-8">Únete a miles de usuarios que ya simplificaron su vida fiscal.</p>
            
            <Button 
              fullWidth 
              onClick={onComplete}
              className="h-14 text-base font-semibold shadow-lg shadow-indigo-200"
            >
              Ingresar a mi cuenta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};