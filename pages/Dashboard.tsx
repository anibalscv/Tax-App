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
    <div className="flex-1 bg-slate-50 flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8 md:px-10 md:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total por pagar</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">${totalPending.toFixed(2)}</h1>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <RefreshCw className="w-3 h-3 mr-1" /> Sincronizado hace 2m
                </span>
              </div>
            </div>
            
            <div className="hidden md:block text-right">
              <p className="text-slate-900 font-medium">Hola, {data.user.full_name.split(' ')[0]}</p>
              <p className="text-sm text-slate-500">ID: {data.user.tax_id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax List */}
      <div className="flex-1 px-6 py-8 md:px-10 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Tus Obligaciones</h3>
          <Button variant="outline" className="text-slate-500 hidden md:flex">
            <FileText className="mr-2 h-4 w-4" /> Ver Historial
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tax_records.map((tax) => (
            <Card 
              key={tax.id} 
              className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${tax.status === 'paid' ? 'border-l-emerald-500' : tax.status === 'overdue' ? 'border-l-red-500' : 'border-l-amber-500'}`}
              onClick={() => tax.status !== 'paid' && onSelectTax(tax.id)}
            >
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div className="space-y-3 mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-900 leading-tight">{tax.type}</h4>
                    {tax.status === 'overdue' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">{tax.period}</p>
                    <p className="text-xs text-slate-400">Vence: {new Date(tax.due_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(tax.status)}`}>
                    {getStatusText(tax.status)}
                  </span>
                </div>
                
                <div className="flex items-end justify-between pt-4 border-t border-slate-100 mt-auto">
                  <p className="font-bold text-2xl">${tax.amount.toFixed(0)}</p>
                  {tax.status !== 'paid' ? (
                    <Button variant="ghost" className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      Pagar <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                     <div className="flex items-center text-emerald-600 text-sm font-medium">
                       <Check className="h-4 w-4 mr-1" /> Pagado
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-6 md:hidden">
           <Button variant="outline" fullWidth className="text-slate-500 border-dashed">
              <FileText className="mr-2 h-4 w-4" /> Ver Historial Completo
           </Button>
        </div>
      </div>
    </div>
  );
};