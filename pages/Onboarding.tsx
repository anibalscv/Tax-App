import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRight, Clock, ShieldCheck, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="flex-1 flex flex-col p-8 justify-between bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
      <div className="pt-12">
        <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Adiós filas.<br/>Hola libertad.
        </h1>
        <p className="text-indigo-100 text-lg leading-relaxed">
          La forma más inteligente de gestionar tus obligaciones fiscales. Sin estrés, sin demoras y 100% seguro.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
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

        <Button 
          fullWidth 
          variant="secondary" 
          onClick={onComplete}
          className="h-14 text-base font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};