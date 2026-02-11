import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { TaxRecord, LinkedAccount } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Share2, Download } from 'lucide-react';

interface PaymentProps {
  taxId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const Payment: React.FC<PaymentProps> = ({ taxId, onBack, onSuccess }) => {
  const [tax, setTax] = useState<TaxRecord | undefined>();
  const [account, setAccount] = useState<LinkedAccount | undefined>();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'review' | 'success'>('review');

  useEffect(() => {
    const record = db.getTaxRecord(taxId);
    const user = db.getState().user;
    if (record) setTax(record);
    if (user?.linked_accounts?.length) setAccount(user.linked_accounts[0]);
  }, [taxId]);

  const handlePay = async () => {
    if (!tax) return;
    setLoading(true);
    try {
      await db.payTax(tax.id);
      setLoading(false);
      setStep('success');
    } catch (e) {
      setLoading(false);
      alert('Error en el pago');
    }
  };

  if (!tax) return <div>Cargando...</div>;

  if (step === 'success') {
    return (
      <div className="flex-1 flex flex-col p-6 items-center justify-center text-center animate-in zoom-in duration-300">
        <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">¡Pago Exitoso!</h1>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          Tu pago de <strong>{tax.type}</strong> ha sido procesado correctamente.
        </p>

        <Card className="w-full mb-8 bg-slate-50 border-slate-200">
          <CardContent className="p-4 space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Monto</span>
                <span className="font-bold">${tax.amount.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Transacción</span>
                <span className="font-mono">TX-{Date.now().toString().slice(-6)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fecha</span>
                <span>{new Date().toLocaleDateString()}</span>
             </div>
          </CardContent>
        </Card>

        <div className="w-full space-y-3">
          <Button fullWidth variant="outline" onClick={() => alert('PDF Descargado')}>
            <Download className="mr-2 h-4 w-4" /> Descargar Comprobante
          </Button>
          <Button fullWidth variant="secondary" onClick={() => alert('Enviado a contador por WhatsApp')}>
            <Share2 className="mr-2 h-4 w-4" /> Enviar a Contador
          </Button>
          <Button fullWidth onClick={onSuccess} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 flex items-center gap-4 bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h2 className="font-semibold text-lg">Confirmar Pago</h2>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-6">
          {/* Summary */}
          <div className="text-center py-6">
            <p className="text-slate-500 mb-1">Total a pagar</p>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">${tax.amount.toFixed(2)}</h1>
            <p className="text-sm text-slate-400 mt-2">Vencimiento: {new Date(tax.due_date).toLocaleDateString()}</p>
          </div>

          {/* Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-slate-600">Impuesto</span>
                <span className="font-medium text-slate-900">{tax.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Periodo</span>
                <span className="font-medium text-slate-900">{tax.period}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 ml-1">Método de Pago</h3>
            <div className="bg-white p-4 rounded-xl border border-indigo-200 ring-1 ring-indigo-500 shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700">
                    <CreditCard className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="font-medium text-slate-900">{account?.bank} •••• {account?.last_four}</p>
                    <p className="text-xs text-slate-500">Crédito</p>
                 </div>
               </div>
               <Button variant="ghost" className="text-indigo-600 text-sm h-8 px-2">Cambiar</Button>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="mt-6 space-y-4">
           <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
             <Lock className="h-3 w-3" /> Pagos procesados con seguridad SSL de 256 bits
           </div>
           <Button fullWidth onClick={handlePay} isLoading={loading} className="h-14 text-lg shadow-xl shadow-indigo-200">
             Pagar ${tax.amount.toFixed(2)}
           </Button>
        </div>
      </div>
    </div>
  );
};