import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { TaxRecord, LinkedAccount } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Share2, Download, Building2 } from 'lucide-react';

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
      <div className="flex-1 flex flex-col p-6 items-center justify-center text-center animate-in zoom-in duration-300 min-h-full">
        <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
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
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      <div className="p-4 md:p-6 flex items-center gap-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h2 className="font-semibold text-lg md:text-xl">Confirmar Pago</h2>
      </div>

      <div className="p-6 md:p-10 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Column: Summary & Details */}
          <div className="space-y-8">
            <div className="text-center md:text-left py-6 md:py-0">
              <p className="text-slate-500 mb-1 font-medium">Total a pagar</p>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">${tax.amount.toFixed(2)}</h1>
              <p className="text-sm text-slate-500 mt-2">Vencimiento: {new Date(tax.due_date).toLocaleDateString()}</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Detalles de la Obligación
                </h3>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-slate-600">Impuesto</span>
                  <span className="font-medium text-slate-900 text-right">{tax.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Periodo</span>
                  <span className="font-medium text-slate-900">{tax.period}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment Method & Action */}
          <div className="space-y-8 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 ml-1">Método de Pago</h3>
              <div className="bg-white p-5 rounded-xl border border-indigo-200 ring-1 ring-indigo-500 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700">
                      <CreditCard className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="font-medium text-slate-900 text-lg">{account?.bank} •••• {account?.last_four}</p>
                      <p className="text-sm text-slate-500">Tarjeta de Crédito</p>
                   </div>
                 </div>
                 <Button variant="ghost" className="text-indigo-600 text-sm h-8 px-3 hover:bg-indigo-50">Cambiar</Button>
              </div>
            </div>

            <div className="space-y-4 mt-8 md:mt-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg">
                 <Lock className="h-4 w-4 text-emerald-600" /> 
                 <span>Pagos procesados con seguridad SSL de 256 bits</span>
               </div>
               <Button fullWidth onClick={handlePay} isLoading={loading} className="h-14 text-lg shadow-lg shadow-indigo-200/50">
                 Pagar ${tax.amount.toFixed(2)}
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};