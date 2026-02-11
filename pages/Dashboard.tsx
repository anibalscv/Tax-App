import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { AppState, TaxRecord } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { AlertCircle, Check, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  onSelectTax: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTax }) => {
  const [data, setData] = useState<AppState | null>(null);

  useEffect(() => {
    // Refresh data on mount
    setData(db.getState());
  }, []);

  if (!data || !data.user) return null;

  const pendingTaxes = data.tax_records.filter(t => t.status !== 'paid');
  const totalPending = pendingTaxes.reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'overdue': return 'Vencido';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Hola, {data.user.full_name.split(' ')[0]}</p>
            <p className="text-xs opacity-70">ID: {data.user.tax_id}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
            {data.user.full_name.charAt(0)}
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-indigo-200 mb-1">Total por pagar</p>
          <h1 className="text-4xl font-bold tracking-tight">${totalPending.toFixed(2)}</h1>
          <div className="mt-4 flex gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-indigo-100">
              <RefreshCw className="w-3 h-3 mr-1" /> Sincronizado hace 2m
            </span>
          </div>
        </div>
      </div>

      {/* Tax List */}
      <div className="flex-1 px-6 -mt-6 pb-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">Obligaciones</h3>
        
        {data.tax_records.map((tax) => (
          <Card 
            key={tax.id} 
            className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${tax.status === 'paid' ? 'border-l-emerald-500' : tax.status === 'overdue' ? 'border-l-red-500' : 'border-l-amber-500'}`}
            onClick={() => tax.status !== 'paid' && onSelectTax(tax.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{tax.type}</h4>
                  {tax.status === 'overdue' && <AlertCircle className="h-4 w-4 text-red-500" />}
                </div>
                <p className="text-sm text-slate-500">{tax.period} • Vence: {new Date(tax.due_date).toLocaleDateString()}</p>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(tax.status)}`}>
                  {getStatusText(tax.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${tax.amount.toFixed(0)}</p>
                {tax.status !== 'paid' ? (
                  <Button variant="ghost" className="h-8 px-2 text-indigo-600 hover:text-indigo-700">
                    Pagar <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                   <div className="flex items-center text-emerald-600 text-sm mt-1 justify-end">
                     <Check className="h-4 w-4 mr-1" /> Pagado
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="pt-4">
           <Button variant="outline" fullWidth className="text-slate-500 border-dashed">
              <FileText className="mr-2 h-4 w-4" /> Ver Historial Completo
           </Button>
        </div>
      </div>
    </div>
  );
};