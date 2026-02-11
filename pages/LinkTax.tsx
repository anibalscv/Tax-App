import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { db } from '../services/mockDb';
import { Building2, ShieldCheck } from 'lucide-react';

interface LinkTaxProps {
  onLinked: () => void;
}

export const LinkTax: React.FC<LinkTaxProps> = ({ onLinked }) => {
  const [taxId, setTaxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await db.linkTaxId(taxId);
    setLoading(false);
    onLinked();
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <div className="pt-8 space-y-4">
        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700">
          <Building2 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Vinculación Fiscal</h1>
        <p className="text-slate-600">
          Conecta con la entidad tributaria para sincronizar tus obligaciones automáticamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Input 
            label="Identificación Fiscal (RUC/RFC/NIT)" 
            placeholder="VJIM880101-ABC"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            required
          />
          <Input 
            label="Clave Tributaria" 
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg flex gap-3 items-start">
          <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
          <p className="text-sm text-emerald-800">
            Tus credenciales están encriptadas de extremo a extremo y nunca se comparten con terceros.
          </p>
        </div>

        <div className="flex-1" /> {/* Spacer */}

        <Button type="submit" fullWidth isLoading={loading} className="mb-4">
          Sincronizar Datos
        </Button>
      </form>
    </div>
  );
};