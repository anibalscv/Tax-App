import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen relative flex flex-col">
        {children}
      </div>
    </div>
  );
};